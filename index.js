
const express = require('express')
const data = require("./data.js");
const app = express()
const port = 5000
const { MongoClient } = require('mongodb');
app.use(express.json())
app.listen(port, () => console.log(`Server running at ${port}`))
const dburl = `mongodb+srv://krishna:krishna123@cluster0.epqt2.mongodb.net/ecommerce?retryWrites=true&w=majority`
const dbname = "nodequiz"

app.get("/", async (req, res) => {
    const client = await MongoClient.connect(dburl)

    try {
        if (client) {
            res.json({
                message: "success"
            })
        }
    } catch (error) {
        console.error(error.message);
    }
    finally {
        client.close()
    }
})
app.get("/insert", async (req, res) => {
    const client = await MongoClient.connect(dburl)

    try {
        const db = client.db(dbname)
        const collections = (await db.listCollections().toArray()).map(ele => ele.name);

        collections.forEach(async (ele) => {
            const result = await db.collection(ele).insertMany(data[ele], { ordered: true })
            console.log(data[ele]);
        })
    } catch (error) {
        res.send(error.message);
    }
    finally {
        client.close()
    }
})
app.get('/search/:collection/:id', async function (req, res) {
    const client = await MongoClient.connect(dburl)

    try {

        const db = client.db(dbname);
        const collection = db.collection(req.params.collection);
        const result = await collection.findOne({ id: parseInt(req.params.id) });
        if (result) {
            res.json({
                message: "here your Result",
                result
            });
        } else {
            res.json({
                message: "Oops! It Missing/not entered"
            });
        }
    } catch (error) {
        console.log(error)
    }
    finally {
        client.close();
    }
})

app.put('/update/:id', async function (req, res) {
    const client = await MongoClient.connect(dburl)

    try {

        const db = client.db(dbname);
        const collection = db.collection("questions");
        const result = collection.findOneAndUpdate({ id: parseInt(req.params.id) }, { $set: { question: req.body.questions } });
        if (result) {
            res.json({
                message: "here your Result",
                result
            });
        } else {
            res.json({
                message: "Oops! It Missing/not entered"
            });
        }
    } catch (error) {
        console.log(error)
    }
    finally {
        client.close();
    }
})
app.delete('/delete/:collection/:id', async function (req, res) {
    const client = await MongoClient.connect(dburl)
    try {
        const db = client.db(dbname);
        const record = await db.collection(req.params.collection).deleteMany({ id: parseInt(req.params.id) });
        if (record) {
            res.json({
                message: "Record is deleted",
            });
        } else {
            res.json({
                message: "Record not found"
            });
        }
    } catch (error) {
        console.log(error)
    } finally {

        await client.close();

    }
})


