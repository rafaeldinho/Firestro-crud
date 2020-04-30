//! IMPORTAMOS LIBS.
const express = require('express');
const bodyParser = require('body-parser');
const Firestore = require('@google-cloud/firestore');
require('dotenv').config()
const {PARENT_COLLECTION,PARENT_DOCUMENT,SUB_COLLECTION} = process.env;

//! CREAMOS NUEVA INSTACIA DE FIRESTORE
const db = new Firestore({
    projectId: 'xxxx-x-xxxx-xxx',
    keyFilename: 'yyyy.json',
});

//!! NUEVA INSTANCIA DE EXPRESS SERVER
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const SODC = db.collection(PARENT_COLLECTION).doc(PARENT_DOCUMENT).collection(SUB_COLLECTION);

//! RUTA
app.post('/', async function (req, res) {

    //! EXTREA LIMIT DEL BODY REQUEST
    let {limit} = req.body;
    let rstList = []

    //! OPERACION
    await SODC.limit(limit).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                rstList.push(doc.data());
            });
        }).catch((err) => {
            console.log('Error getting documents', err);
        });
    res.send(rstList);
});

//! LISTENER
app.listen(3000, () => console.log(`🚀 http://localhost:${3000}`))