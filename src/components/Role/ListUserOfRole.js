import React , {useState , useEffect} from 'react'
import axios from 'axios'
import API from "../../Config/config"
import {useHistory } from 'react-router-dom';
import paginate from "../../utils/helper";
import queryString from 'query-string'
import {useGlobalContext} from "../../context/LoginContext"
export default function ListUserOfRole() {
    const history = useHistory()
    const {checklogin, IsLogin} = useGlobalContext();
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [ListUserOfRole , setListUserOfRole] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    useEffect(() => {
        checklogin();
        let id = window.location.pathname.split('/')
        let token = {
            headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
        }
        axios.get(`http://localhost:9090/api/v1/role/userRole/${id[id.length-1]}`,token).then((response)=> {
            setData(response.data.content);
            setLoading(false)
            console.log(response.data);
        }).catch((error) =>{
        });
    }, [])

    useEffect(() => {
        if (loading) return
        if(data.length>0){
            console.log((data))
            setDataPaginate(paginate(data))
            // console.log(dataPaginate)
            setListUserOfRole(paginate(data)[page]);
            console.log(ListUserOfRole)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListUserOfRole([])
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

    const list = ListUserOfRole
    const renderList = list.map((UserOfRole, index) => {
        return (
            <tr key = {index}>
                <th scope="row">{UserOfRole.id}</th>
                <td>{UserOfRole.fullName}</td>
                <td>{UserOfRole.userName}</td>
                <td>{UserOfRole.phoneNumber}</td>
                <td>{UserOfRole.address}</td>
            </tr>
        );
    });

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="col-5 align-self-center">
                    <h4 className="page-title">UserOfRole</h4>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">List UserOfRole <button className="btn1 btn btn-info" onClick ={e => {history.push("/role")}}>Back</button></h4>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Full Name</th>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col">Address</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {renderList.length > 0
                                        ? renderList
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
