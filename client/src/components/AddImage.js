import Model from "./UI/Model";
import Input from './UI/Input';
import '../style/form.css';
import Button from "./UI/Button";
import {setImage} from '../firebaseApp';
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
export default function AddImage(props){
    const [submitting, setSubmitting] = useState(false);
    const formik = useFormik({
        initialValues: {
            url: '',
            label:''
        },
        validationSchema: Yup.object().shape({
            url: Yup.string()
                .ensure()
                .trim()
                .required()
                .url('it is not a valid url'),
            label: Yup.string()
                .ensure()
                .trim()
                .required()
                .min(8)
                .max(20)
        }),
        onSubmit: (values) => {
            setSubmitting(true);
            setImage(values).catch(err => {
                console.error(err);
            }).finally(() => {
                setSubmitting(false);
                props.onClose();
            })
        }
    });

    return <Model>
        <h3 style={{ color: "#333333", fontSize: '24px' }}>Add a new photo</h3>
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="img-lable">Label</label>
            <Input type="text" placeholder="Enter Label" id="img-lable" required={true} name="label" onChange={formik.handleChange} style={{ borderColor: formik.errors.label && formik.touched.label ? 'red' : '#4F4F4F' }} />
            {formik.errors.label && formik.touched.label && <span>{formik.errors.label}</span>}
            <label htmlFor="img-url">Photo URL</label>
            <Input type="url" placeholder="Enter a image URL" id="img-url" required={true} name="url" onChange={formik.handleChange} style={{ borderColor: formik.errors.url && formik.touched.url ? 'red' : '#4F4F4F' }} />
            {formik.errors.url && formik.touched.url && <span>{formik.errors.url}</span>}
            <div className="btn-container">
                <Button className="cancel-new-photo" type="button" onClick={props.onClose} disabled={submitting}>Cancel</Button>
                <Button className="submit-new-photo" type="submit" disabled={submitting}>{submitting ? "Submitting" : "Submit"}</Button>
            </div>
        </form>
        </Model>
}