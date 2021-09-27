import React, {useState, useEffect, useContext, useRef} from 'react'
import Api from "../../Config/config"
import {useHistory } from 'react-router-dom';
import {useGlobalContext} from "../../context/LoginContext";
import paginate from "../../utils/helper";
import API from "../../Config/config";
// import { success } from '../Helper/Notification';

export default function Employees() {
    const history = useHistory();
    const {checklogin, IsLogin} = useGlobalContext();
    const [ListEmployee , setListEmployee] = useState([]);
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [runuseEff, setrunuseEff] = useState(1)
    let token = {
        headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    }
    useEffect(() => {
        Api.get('admin/user/employee',token).then((response)=> {
            setData(response.data.content);
            setLoading(false)
            console.log(response.data.content);
        }).catch((error) =>{
        });
    }, [runuseEff])

    useEffect(() => {
        if (loading) return
        if(data.length>0){
            console.log((data))
            setDataPaginate(paginate(data))
            // console.log(dataPaginate)
            setListEmployee(paginate(data)[page]);
            console.log(ListEmployee)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListEmployee([])
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


    function deleteEmployee (id) {
        Api.delete(`admin/user/${id}`,token).then((response)=> {
            setrunuseEff(id)
            // success('Deleted category');
        }).catch((error) =>{
            alert(error.data)
        });
    }

    const [searchValue, setsearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchTerm) => {
        setsearchValue(searchTerm);
        if (searchValue !== "") {
            Api.get('admin/user/employee?search='+searchValue, token).then((response)=> {
                console.log(response.data)
                setListEmployee(response.data.content);
            }).catch((error) =>{
            });

            const newEmployeeList = ListEmployee.filter((employee) => {
                return Object.values(employee)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
            });
            setSearchResults(newEmployeeList);
        } else {
            setSearchResults(ListEmployee);
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

    const list = searchValue.length < 1 ? ListEmployee : searchResults
    const renderEmployeeList = list.map((Employee, index) => {
        return (
            <tr key={index}>
                <th scope="row">{Employee.id}</th>
                <td>{Employee.fullName}</td>
                <td>{Employee.userName}</td>
                <td>{Employee.phoneNumber}</td>
                <td>{Employee.email}</td>
                <td>{Employee.address}</td>
                <td><button className="btn btn-info" onClick ={ e=> {history.push(`/editemployee/${Employee.id}`)}}>edit</button> <button
                    className="btn btn-danger" onClick = {deleteEmployee.bind(this,Employee.id)}>delete</button></td>
            </tr>
        );
    });

    return (
        <>
            {(IsLogin === false ) ? (
                <div className="page-wrapper">
                    <h3 style={{textAlign : "center"}}>you need login</h3>
                </div>
            ) : (
                <div className="page-wrapper">
                    <div className="page-breadcrumb">
                        <div className="col-5 align-self-center">
                            <h4 className="page-title">Employee</h4>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">List Employee </h4>
                                        <input
                                            className="input-search"
                                            placeholder="Search..."
                                            onChange={search}
                                            value={searchValue}
                                            ref={input}
                                        ></input>
                                        {/*<button onClick={search}className="btn-search "><i  className="fa fa-search" aria-hidden="true"></i></button>*/}
                                        <button className="btn1 btn btn-success" onClick ={e => {history.push("/newemployee")}}>new</button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th scope="col">Id</th>
                                                <th scope="col">Full Name</th>
                                                <th scope="col">User Name</th>
                                                <th scope="col">Phone Number</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Address</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {renderEmployeeList.length > 0
                                                ? renderEmployeeList
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
            )}
        </>
    )
}
