import React, {useState, useEffect, useRef} from 'react'
import API from "../../Config/config"
import {useGlobalContext} from "../../context/LoginContext";
import { useHistory } from 'react-router-dom';
import paginate from "../../utils/helper";
import Api from "../../Config/config";
// import { success } from '../Helper/Notification';
export default function Customers() {
    const history = useHistory();
    const {checklogin, IsLogin} = useGlobalContext();
    const [ListCustomer , setListCustomer] = useState([]);
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [runuseEff, setrunuseEff] = useState(1)

    let token = {
        headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    }

    const [filters, setFilters] = useState({
        page: 0,
        customer_delete_id: 0
    })

    useEffect(() => {

        API.get('user/customer',token).then((response)=> {
            setData(response.data.content);
            setLoading(false)
            console.log(response.data.content);
        }).catch((error) =>{
        });
    }, [runuseEff, filters])

    useEffect(() => {
        if (loading) return
        if(data.length>0){
            console.log((data))
            setDataPaginate(paginate(data))
            // console.log(dataPaginate)
            setListCustomer(paginate(data)[page]);
            console.log(ListCustomer)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListCustomer([])
        }
    }, [data,loading, page]);

    const nextPage = () => {
        setPage((oldPage) => {
            console.log(oldPage)
            let nextPage = oldPage + 1
            if (nextPage > dataPaginate.length - 1) {
                nextPage = 0
            }
            return nextPage
        })
    }
    const prevPage = () => {
        //oldPage la page truoc do cua var Page
        setPage((oldPage) => {
            console.log(oldPage)
            let prevPage = oldPage - 1
            if (prevPage < 0) {
                prevPage = dataPaginate.length - 1
            }
            return prevPage
        })
    }

    const handlePage = (index) => {
        setPage(index)
    }

    function deleteCustomer (id) {
        let token = {
            headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
        }
        API.delete(`user/${id}`,token).then((response)=> {
            // alert(response.data.message)
            // setrunuseEff(id)
            setFilters({...filters, category_delete_id: id})
            // success('Deleted Customer');
        }).catch((error) =>{
            alert(error.data)
        });
    }

    const [searchValue, setsearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchTerm) => {
        setsearchValue(searchTerm);
        if (searchValue !== "") {
            API.get('user/customer?search='+searchValue, token).then((response)=> {
                // console.log(response.data)
                setListCustomer(response.data.content);
            }).catch((error) =>{
            });

            const newCustomerList = ListCustomer.filter((customer) => {
                return Object.values(customer)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
            });
            setSearchResults(newCustomerList);
        } else {
            setSearchResults(ListCustomer);
        }
        // showAlert(true, 'success', 'search value');
    };

    const input = useRef("")
    // useEffect(() => {
    //     input.current.focus();
    // }, [])
    function search (){
        searchHandler(input.current.value)
    }

    const list = searchValue.length < 1 ? ListCustomer : searchResults
    const renderCustomerList = list.map((Customer, index) => {
        return (
            <tr key={index}>
                <th scope="row">{Customer.id}</th>
                <td>{Customer.fullName}</td>
                <td>{Customer.userName}</td>
                <td>{Customer.email}</td>
                <td>{Customer.phoneNumber}</td>
                <td>{Customer.address}</td>
                <td><button className="btn btn-info" onClick ={ e=> {history.push(`/edit-customer/${Customer.id}`)}}>Edit</button> <button
                    className="btn btn-danger" onClick = {deleteCustomer.bind(this,Customer.id)}>Delete</button></td>
            </tr>
        );
    });

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-5 align-self-center">
                        <h4 className="page-title">Customer</h4>
                    </div>

                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">List Customer <button className="btn1 btn btn-success" onClick ={e => {history.push("/new-customer")}}>New</button></h4>
                                <input
                                    className="input-search"
                                    placeholder="Search..."
                                    onChange={search}
                                    value={searchValue}
                                    ref={input}
                                ></input>
                                <button className="btn-search " onClick={search}><i className="fa fa-search"></i></button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Full Name</th>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col">Address</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {renderCustomerList.length > 0
                                        ? renderCustomerList
                                        : "No Product available"}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {!loading && (
                        <div className='btn-container'>
                            <button
                                className='prev-btn'
                                // onClick={props.prevPage}
                                onClick={prevPage}
                            >
                                prev
                            </button>
                            {/*{props.dataPaginate.map((item, index) => {*/}
                            {dataPaginate.map((item, index) => {
                                return (
                                    <button
                                        key={index}
                                        // className={`page-btn ${index === props.page ? 'active-btn' : null}`}
                                        className={`page-btn ${index === page ? 'active-btn' : null}`}
                                        // onClick={() => props.handlePage(index)}
                                        onClick={() => handlePage(index)}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            })}
                            <button
                                className='next-btn'
                                // onClick={props.nextPage}
                                onClick={nextPage}
                            >
                                next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
