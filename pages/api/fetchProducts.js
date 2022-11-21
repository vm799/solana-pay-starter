import products from "./products.json"

export default function handler(req, res) {
    // if GET request
    if (req.method === "GET") {

    // then create a copy of product without the hash and filename
        const productsNoHashes = products.map((product) => {
            const { hash, filename, ...rest }  = product;
            return rest;
        });

        res.status(200).json(productsNoHashes);
    }
    else {
        res.status(405).send(`Method ${req.method} not allowed`);
    }
}