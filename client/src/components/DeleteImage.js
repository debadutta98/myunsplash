import Model from "./UI/Model";
import Input from './UI/Input';
import '../style/form.css';
import Button from "./UI/Button";
import { useState } from "react";
import { deleteImage } from "../firebaseApp";
import { useFormik } from "formik";
import * as Yup from 'yup';

export default function DeleteImage(props) {
    const [deleting, setDeleting] = useState(false);
    const formik = useFormik({
        initialValues:{
            typedLabel: ''
        },
        validationSchema: Yup.object().shape({
            typedLabel: Yup.string()
                .ensure()
                .strict(true)
                .trim('Expect it to match original label')
                .required('The value of image label is a required field')
                .matches(new RegExp(props.imgLabel), {
                    message: 'Expect it to match original label',
                    excludeEmptyString:false
                })
        }),
        onSubmit:()=>{
            setDeleting(true);
                deleteImage(props.imageId).catch(error => {
                    console.error(error);
                }).finally(() => {
                    props.onClose();
                    setDeleting(false);
                });
            } 
    });

    return <Model>
        <h3 style={{ color: "#333333", fontSize:'24px'}}>Are you sure?</h3>
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="image-label-input">Please type <b style={{cursor:'text'}}>{props.imgLabel}</b> to confirm</label>
            <Input type="text" placeholder="Type here..." id="image-label-input" required={true} name="typedLabel" onChange={formik.handleChange} style={{ borderColor: formik.errors.typedLabel && formik.touched.typedLabel ? 'red' : '#4F4F4F' }} />
            {formik.errors.typedLabel && formik.touched.typedLabel && <span>{formik.errors.typedLabel}</span>}
            <span></span>
                <div className="btn-container">
                    <Button className="cancel-new-photo" disabled={deleting} onClick={(event) => { event.preventDefault(); props.onClose(); }} type="button">Cancel</Button>
                    <Button className="delete-photo" disabled={deleting} type="submit">{deleting ? "Deleting" : "Delete"}</Button>
                </div>
            </form>
    </Model>
}