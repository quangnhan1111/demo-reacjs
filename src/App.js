import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
// import LoginContextProvider from './context/LoginContext'
import { AppProvider } from './context/LoginContext'
import Home from './components/Home/Home';
import Products from './components/Products/Products';
import ProductDetail from './components/Products/ProductDetail';
import NewProduct from './components/Products/NewProduct';
import EditProduct from './components/Products/EditProduct';
import Categorys from './components/Categorys/Categorys';
import AddCategory from './components/Categorys/AddCategory';
import EditCategory from './components/Categorys/EditCategory';
import Login from './components/Login/Login';
import Sale from './components/Sale/Sale';
import AddBrand from "./components/Brands/AddBrand";
import EditBrand from "./components/Brands/EditBrand";
import Brands from "./components/Brands/Brands";
import NewEmployee from "./components/Employee/NewEmployee";
import Employees from "./components/Employee/Employees";
import EditEmployee from "./components/Employee/EditEmployee";
import Customers from "./components/customer/Customers";
import NewCustomer from "./components/customer/NewCustomer";
import EditCustomer from "./components/customer/EditCustomer";
import NewColor from "./components/color/NewColor";
import Colors from "./components/color/Colors";
import EditColor from "./components/color/EditColor";
import Images from "./components/image/Images";
import NewImage from "./components/image/NewImage";
import EditImage from "./components/image/EditImage";
import MyAccount from "./components/Account/MyAccount";
import EditAccount from "./components/Account/EditAccount";
import Posts from "./components/Post/Posts";
import AddPost from "./components/Post/AddPost";
import EditPost from "./components/Post/EditPost";
import ViewPost from "./components/Post/ViewPost";
import Review from "./components/Review/Review";
import ViewReview from "./components/Review/ViewReview";
import ListUserOfRole from "./components/Role/ListUserOfRole";
import Role from "./components/Role/Role";
import Invoices from "./components/Invoice/Invoices";
import EditInvoice from "./components/Invoice/EditInvoice";
import NewInvoice from "./components/Invoice/NewInvoice";
import ViewInvoice from "./components/Invoice/ViewInvoice";
function App() {
  return (
      <Router>
        <div id="main-wrapper" data-navbarbg="skin6" data-theme="light" data-layout="vertical" data-sidebartype="full" data-boxed-layout="full">
          <AppProvider>
            <Home/>
            {/*<Alert stack={ { limit: 3 } } />*/}
            <Switch>

              <Route exact path='/'
                     component={ localStorage.getItem("roleNames") === "admin" ? Sale : localStorage.getItem("roleNames") === "employee" ? Products :Login }
              />
              <Route exact path='/login' component={Login}/>
              <Route path='/products' component={Products}/>

              <Route path='/product/:id' component={ProductDetail}/>
              <Route path='/newproduct' component={NewProduct}/>

              <Route path='/editproduct/:id' component={EditProduct}/>
              <Route path='/categorys' > <Categorys/>  </Route>
              <Route path='/addcategory' > <AddCategory/>  </Route>
              <Route path='/editcategory/:id' component={EditCategory}/>
              <Route path='/newbrand' > <AddBrand/>  </Route>
              <Route path='/editbrand/:id'> <EditBrand/>  </Route>
              <Route path='/brands' > <Brands/>  </Route>
              <Route path='/color' component={Colors}/>
              <Route path='/newcolor' component={NewColor}/>
              <Route path='/editcolor/:id' component={EditColor}/>
              <Route path='/image' component={Images}/>
              <Route path='/newimage' component={NewImage} />
              <Route path='/editimage/:id' component={EditImage}/>

              <Route path='/customer' component={Customers}/>
              <Route path='/new-customer' component={NewCustomer}/>
              <Route path='/edit-customer/:id' component={EditCustomer}/>
              <Route path='/newemployee' > <NewEmployee/>  </Route>
              <Route path='/Employee' > <Employees/>  </Route>
              <Route path='/editemployee/:id' > <EditEmployee/>  </Route>

              <Route path='/myaccount' component={MyAccount} />
              <Route path='/editAccount/:id' component={EditAccount}/>

              <Route path='/posts' component={Posts}/>
              <Route path='/add-post' component={AddPost}/>
              <Route path='/edit-post/:id' component = {EditPost} />
              <Route path='/view-post/:id' component = {ViewPost} />

              <Route path='/reviews' > <Review/>  </Route>
              <Route path='/view-review/:id' component={ViewReview} />

              <Route path='/role' component={Role}/>
              <Route path='/userofrole/:id' component={ListUserOfRole}/>

              <Route path='/sale' > <Sale/>  </Route>

              <Route path='/invoice' component={Invoices} />
              <Route path='/new-invoice' component={NewInvoice} />
              <Route path='/view-invoice/:id' component={ViewInvoice} />
              <Route path='/edit-invoice/:id' component={EditInvoice} />

            </Switch>
          </AppProvider>
        </div>
      </Router>
  );
}

export default App;
