import * as Yup from 'yup';

class SupplierYup {
    addSupplier = Yup.object().shape({
        // email: Yup.string().email().required(),
        name: Yup.string().required(),
        email: Yup.string()
            .required("Email is required")
            .email("Invalid email address"),
        mobile: Yup.number().required()  
            .test("len", "Mobile number must be 9 digits", val => val && val.toString().length === 9),
        website: Yup.string().required()
    });

    getSupplier = Yup.object().shape({
        id: Yup.string().required()
    });

    deleteSupplier = Yup.object().shape({
        id: Yup.string().required()
    });

    updateSupplier = Yup.object().shape({
        // id: Yup.string().required(),
        name: Yup.string().required(),
        email: Yup.string()
            .required("Email is required")
            .email("Invalid email address"),
        mobile: Yup.number().required()
        .test("len", "Mobile number must be 9 digits", val => val && val.toString().length === 9),
        website: Yup.string().required()
    });
}

export default new SupplierYup();
