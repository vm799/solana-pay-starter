import React, { useState } from "react";
import { create } from "ipfs-http-client";
import styles from "../styles/CreateProduct.module.css";

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateProduct = () => {
    const [newProduct, setNewProduct] =  useState({
        name: "",
        price: "",
        image_url: "",
        description:"",
    });

    const [file, setFile] = useState({});
    const [uploading, setUploading] = useState(false);

    async function onChange(e) {
        setUploading(true);
        const files = e.target.files;
        try{
            console.log(files[0]);
            const added = await client.add(files[0]);
            setFile({ filename: files[0].name, hash: added.path });
        } catch (error){
            console.log("Error uploading file: ", error);
        }
        setUploading(false);
        }

        const CreateProduct = async () => {
            try {
                const
            }
        }
    }
}