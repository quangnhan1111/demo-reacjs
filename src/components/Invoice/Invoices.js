import React , {useState , useEffect, useContext} from 'react'
import API from "../../Config/config"
import queryString from 'query-string'
import { useHistory } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import {useGlobalContext} from "../../context/LoginContext";
import paginate from "../../utils/helper";
// import { success } from '../Helper/Notification';
export default function Invoices() {

    const {checklogin, IsLogin} = useGlobalContext();
    const history = useHistory()


    const [filters, setFilters] = useState({
        page: 0,
        invoice_delete_id: 0
    })
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [ListInvoice , setListInvoice] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const token = {
        headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    }

    useEffect(() => {
        async function getData () {
            let token = {
                headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
            }
            checklogin();
            const paramsString = queryString.stringify(filters)
            const requestUrl = `/invoice/ByCustomer/status?${paramsString}`
            API.get(requestUrl,token).then((response)=> {
                console.log(response.data.content)
                setData(response.data.content);
                setLoading(false)

            }).catch((error) =>{
            });
        }
        getData();
    }, [filters])


    useEffect(() => {
        if (loading) return
        if(data.length>0){
            console.log((data))
            setDataPaginate(paginate(data))
            // console.log(dataPaginate)
            setListInvoice(paginate(data)[page]);
            console.log(ListInvoice)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListInvoice([])
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

    const deleteInvoice = (e) => {
        e.preventDefault()
        let id = e.target.id.toString()

        API.delete('invoice/' + id, token)
            .then(response => {
                console.log(response.data)
                setFilters({...filters, invoice_delete_id: id})
                // success('Successfully deleted invoice');

            })
            .catch(errors => {
                console.log(errors)
            })
    }

    const list = ListInvoice
    const renderInvoiceList = list.map((Invoice, index) => {
        return (
            <tr key = {index}>
                <th scope="row">{Invoice.id}</th>
                <td>{(Invoice.nameCustomer)}</td>
                <td>{(Invoice.is_paid) ? "Paid" : "Unpaid"} </td>

                <td> <button id = {Invoice.id} onClick ={ e=> {history.push(`/view-invoice/${Invoice.id}`)}} className="btn btn-success">View</button> <button
                    id = {Invoice.id} onClick ={ e=> {history.push(`/edit-invoice/${Invoice.id}`)}} className="btn btn-info">Edit</button> <button
                    id = {Invoice.id} onClick={deleteInvoice} className="btn btn-danger">Delete</button></td>
            </tr>
        );
    });

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-5 align-self-center">
                        <h4 className="page-title">Invoice</h4>
                    </div>

                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">List Invoice <button className="btn1 btn btn-success" onClick ={e => {history.push("/new-invoice")}}>New</button></h4>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {renderInvoiceList.length > 0
                                        ? renderInvoiceList
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
