import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { set, useForm } from "react-hook-form";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/material";
import axios from "axios";
import { Delete, HeartBrokenRounded, HeatPumpRounded } from "@mui/icons-material";
import { BiHeartCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const Dashboard = ({cartItems,setCartItems}) => {
  const [openAdditem, setOpenitem] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const[imageURl,setImageURL]=useState("");
  const[existingDatas,setExistingDatas]=useState([]);
  const[dashboardData,setDashboardData]=useState("");


  const { register, handleSubmit, setValue } = useForm();

  const handleAddItemOpen = () => {
    setOpenitem(true);
  };

  const handleAddItemClose = () => {
    setOpenitem(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setValue("ImageURL", result);
        setImageURL(result);
        setValue("imageName", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getapi();
  }, [])

  useEffect(() => {
    // Get the cart items from local storage when the component mounts
    const cartItemsFromStorage = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(cartItemsFromStorage);
  }, []);
  


  const getapi =()=>{
      axios.get("http://localhost:5000/Dashboardget").then((result) => {
         console.log(result.data,"dashboardget");
         setDashboardData(result.data);
      }).catch((err) => {
          console.log(err);
      });
  }


  const onAdditemSubmit = (data) => {
    console.log(data);
    axios.post("http://localhost:5000/DashboardPost",data).then((result) => {
       console.log(result.data,"dahboardpost")
       handleAddItemClose();
       getapi();

    }).catch((err) => {
        console.log(err);
    });
  };

  const handleDashboardDelete =(id)=>{
     axios.delete(`http://localhost:5000/DashboardDelete/${id}`).then((result) => {
        console.log(result.data);
        getapi();
     }).catch((err) => {
        console.log(err);
     });
  }
  const navi = useNavigate();

  const handleDashboardFavorites = (item) => {
    console.log(item, "item");
    const itemExist = cartItems.find((cartItem) => cartItem._id === item._id);
    if (!itemExist) {
      const updatedCartItems = [...cartItems, item];
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      Swal.fire({
        title: "Good job!",
        text: `You Item ${item.productname} Added to Cart!`,
        icon: "success"
      });
    }
  };
  
  
  return (
    <div>
      <h1 className="d-flex justify-content-center mt-5 fw-bolder">
        Admin Dashboard
      </h1>
      <div className="button d-flex justify-content-around">
        <Button variant="contained" onClick={handleAddItemOpen}>
          Add item
        </Button>
        <Button variant="contained"  >
        <Link to="/Fav"  style={{textDecoration:"none",color:"#fff"}}>  Favorites</Link>
        </Button>
      </div>


      <div className="Table mt-5">
        <Container>
       {dashboardData.length ? (<>
       
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ProductName</TableCell>
                  <TableCell >ProductDesscription</TableCell>
                  <TableCell >ProductPrice</TableCell>
                  <TableCell >ProductImage</TableCell>
                  <TableCell >Delete</TableCell>
                  <TableCell >Favorites</TableCell>


                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.length && dashboardData.map((row) => (
                  <TableRow
                    key={row.productname}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.productname}
                    </TableCell>
                    <TableCell >{row.productdescription}</TableCell>
                    <TableCell >{`${row.price}rs`}</TableCell>
                    <TableCell><img src={row.ImageURL} alt="img" width="100px" /></TableCell>
                    <TableCell><Delete onClick={()=> handleDashboardDelete(row._id)}/></TableCell>
                    <TableCell><BiHeartCircle onClick={()=> handleDashboardFavorites(row)} style={{fontSize:"30px"}}/></TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
       
       
       </>):(<h1 className=" d-flex justify-content-center  fw-bolder mt-5">Items Not Found</h1>)}
        </Container>
      </div>

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openAdditem}
        onClose={handleAddItemClose}
      >
        <DialogTitle className="fw-bolder">Add an Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <form onSubmit={handleSubmit(onAdditemSubmit)}>
              <div className="mt-2">
                <TextField
                  placeholder="Product Name"
                  fullWidth
                  label="Product Name"
                  {...register("productname")}
                  type="text"
                />
              </div>

              <div className="mt-2">
                <TextField
                  placeholder="Product Description"
                  fullWidth
                  label="Product Description"
                  {...register("productdescription")}
                  type="text"
                />
              </div>

              <div className="mt-2">
                <TextField
                  placeholder="Price"
                  fullWidth
                  label="Price"
                  {...register("price")}
                  type="number"
                />
              </div>

              <div className="mt-2">
                <div className="mb-2">
                  <TextField
                    name="imageName"
                    fullWidth
                    type="file"
                    onChange={handleImageUpload}
                  />
                </div>
            <label htmlFor="productimage">{imageURl ? <p>Image Uploaded Successfully</p>:<p> Upload a Product Image</p>}</label>

              </div>

              <div className="d-flex justify-content-end mt-2">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
