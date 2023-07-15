//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _=require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//main().catch(err => console.log(err));

//async function main() {
   mongoose.connect('mongodb+srv://admin-verma:ayush@cluster0.xrpeojp.mongodb.net/todolistDB',{useNewUrlParser: true});
   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
   
   const searchArray=["home"];

      const itemsSchema={
        name: String
      };
      const Item=mongoose.model("Item",itemsSchema);
      const item1=new Item({
        name: "Welcome to your todoList!"
      });
      const item2=new Item({
        name: "Hit the + button to add a new item."
      });
      const item3=new Item({
        name: "<-- Hit this to delete and item"
      });
      const defaultItems= [item1,item2,item3];
      //Item.insertMany(defaultItems);
      
      //const items = ["Buy Food", "Cook Food", "Eat Food"];
      const listSchema={
        name: String,
        items: [itemsSchema],
        
      };
      const List=mongoose.model("List",listSchema);


app.get("/", function(req, res) {
  
  itemm();
  async function itemm(){
    
    const itemz=await Item.find();
    
    if(itemz.length===0){
      Item.insertMany(defaultItems);
      res.redirect("/");
    }
    else{
      
      res.render("list", {listTitle: "Today", newListItems: itemz,});// use itemz from line 35
    }
    
    
  }
  
});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  check();

  async function check() {
    const foundList = await List.findOne({ name: customListName });

    if (foundList) {
      res.render("list",{listTitle: foundList.name, newListItems: foundList.items})
    } else {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
    }
  }
});
            

    app.post("/", function(req, res){
      
  const itemName = req.body.newItem;
  const listName=req.body.list;
  
  const item=new Item({
    name: itemName
  });
    if(listName==="Today"){

      item.save();
      res.redirect("/");
    }
     else{
      async function findlistname(){
        const foundList=await List.findOne({name: listName});
        foundList.items.push(item);
        foundList.save();
      }
      findlistname();
      res.redirect("/"+listName);
     }
});

app.post("/delete",function(req,res){
const checkedItemId=req.body.checkbox;
const listName=req.body.listName;
if(listName==="Today"){

  async function demlete(){
    await Item.findByIdAndDelete(checkedItemId);
    res.redirect("/");
  }
  demlete();
}
else{
  async function deleteItems(){
    // await Item.findByIdAndRemove(checkedItemId);// it will not work because we have to find from an array which is inside an object.
     await List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}}); //delete isiliye nhi lagaye kyuli pull ek deleting action hai aur wo find krne ke baad pull krlega yani delete krdega.
  
   res.redirect("/"+listName);
  }
  deleteItems();
}

});

// Define a route handler for the homepage


// Define a route handler for form submission
app.post('/search', (req, res) => {
  const searchItem = _.capitalize(req.body.search);
  check();

  async function check() {
    const foundList = await List.findOne({ name: searchItem });

    if (foundList) {
      res.redirect("/"+foundList.name);
    } else {
      const list = new List({
        name: searchItem,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+searchItem);
    }
  }
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000,function(){

  console.log("this app is running on port 3000");
});
//}// this is the closing function of mongoose.main