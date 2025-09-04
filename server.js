import express from "express";
import dotenv from "dotenv";
import {Client, Pool} from "pg";
import { getAverageColor } from 'fast-average-color-node';
import bodyParser from "body-parser";


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config()
const PORT = process.env.PORT;
const client = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.DATABASE,

});


const FACEBOOK = process.env.FACEBOOK
const INSTAGRAM = process.env.INSTAGRAM
const SNAPCHAT = process.env.SNAPCHAT
const EMAIL = process.env.EMAIL



const currentYear = 2025;

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // current page, default 1
    const limit = 5; // blogs per page
    const offset = (page - 1) * limit;

    try {
        const totalResult = await client.query("SELECT COUNT(*) FROM blogs");
        const totalBlogs = parseInt(totalResult.rows[0].count);
        const totalPages = Math.ceil(totalBlogs / limit);

        // Get the blogs for this page (recent first)

        const result = await client.query(
        "SELECT * FROM blogs ORDER BY id DESC LIMIT $1 OFFSET $2",
        [limit, offset]
        );


        res.render("index", {
            blogs: result.rows,
            currentPage: page,
            totalPages: totalPages,
            currentYear: currentYear,
            facebook: FACEBOOK,
            instagram: INSTAGRAM,
            snapchat: SNAPCHAT
        });
    } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching blogs");
  }
});

app.get("/blog/:id", async (req, res) => {
    const postId = req.params.id;

    

    const result = await client.query(
        "SELECT * FROM blogs WHERE id=$1",
        [postId]
        );

        let footerColor;

        if (result.rows[0].cover_img){
        const color = await getAverageColor(`${result.rows[0].cover_img}`) || "";
        footerColor = color.hex;
        } else {
        footerColor = "#787f82";
        }


    res.render("blog", {
        footerColor: footerColor,
        blog: result.rows[0],
        currentYear: currentYear,
        facebook: FACEBOOK,
        instagram: INSTAGRAM,
        snapchat: SNAPCHAT
    });



});

app.get("/about", (req, res) => {
        res.render("about", {
         currentYear: currentYear,
         facebook: FACEBOOK,
        instagram: INSTAGRAM,
        snapchat: SNAPCHAT
    });
});

app.get("/contact", (req, res) => {
        res.render("contact", {
         currentYear: currentYear,
         facebook: FACEBOOK,
         instagram: INSTAGRAM,
         snapchat: SNAPCHAT,
         email: EMAIL
    });
});

app.get("/post-secret-L1@2000Elo", (req, res) => {
    res.render("post", {
        currentYear: currentYear,
        facebook: FACEBOOK,
        instagram: INSTAGRAM,
        snapchat: SNAPCHAT
    })

});

app.post("/post", async (req, res) => {
    const { title, subtitle, cover_img, content} = req.body;
  

    try {
    await client.query(
        "INSERT INTO blogs (title, subtitle, post_content, cover_img, post_date) VALUES ($1, $2, $3, $4, NOW())",
        [title, subtitle, content, cover_img]
    );} catch (err) {
        console.log(err)
    }

    res.redirect("/");

      
});



app.listen(PORT, () => {
    console.log(`Server listens on port:${PORT}`);
})