import React, {useState, useEffect, useContext, useRef} from 'react'
import API from "../../Config/config"
import { Link } from 'react-router-dom'
import paginate from "../../utils/helper";
import queryString from 'query-string'
import {useGlobalContext} from "../../context/LoginContext"
import { useHistory } from 'react-router-dom';
import Api from "../../Config/config";
// import { success } from '../Helper/Notification';
export default function Review() {
    const history = useHistory()
    const {checklogin, IsLogin} = useGlobalContext();
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [ListReview , setListReview] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [filters, setFilters] = useState({
        page: 0,
        category_delete_id: 0
    })


    let token = {
        headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    }
    useEffect(() => {
        async function getData () {
            checklogin();
            const paramsString = queryString.stringify(filters)
            const requestUrl = `review?${paramsString}`
            API.get(requestUrl,token).then((response)=> {
                setData(response.data.content);
                setLoading(false)
                console.log(response.data);
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
            setListReview(paginate(data)[page]);
            console.log(ListReview)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListReview([])
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

    // const viewReview = (e) => {
    //     e.preventDefault()
    //     let id = e.target.id.toString()
    //     console.log(id)
    // }

    const deleteReview = (e) => {
        e.preventDefault()
        let id = e.target.id.toString()
        console.log(id)

        API.delete('review/' + id, token)
            .then(response => {
                setFilters({...filters, category_delete_id: id})
                // console.log(response.data)
                // success('Deleted review');

            })
            .catch(errors => {
                console.log(errors)
            })
    }

    const [searchValue, setsearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchTerm) => {
        setsearchValue(searchTerm);
        if (searchValue !== "") {
            API.get('review?search='+searchValue, token).then((response)=> {
                // console.log(response.data)
                setListReview(response.data.content);

            }).catch((error) =>{
            });

            const newReviewList = ListReview.filter((category) => {
                return Object.values(category)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
            });
            setSearchResults(newReviewList);
        } else {
            setSearchResults(ListReview);
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

    const list = searchValue.length < 1 ? ListReview : searchResults
    const renderReviewList = list.map((Review, index) => {
        return (
            <tr key = {index}>
                <th scope="row">{Review.id}</th>
                <td>{Review.number_Of_Star}</td>
                <td>{Review.content}</td>
                <td>{Review.name_User}</td>
                <td>{Review.email}</td>
                <td>{Review.name_Product}</td>
                <td>  <button id = {Review.id} onClick={deleteReview} className="btn btn-danger">Delete</button></td>
                {/* <td><button id = {Review.id} onClick ={ e=> {history.push(`/view-review/${Review.id}`)}} className="btn btn-success">View</button></td> */}
            </tr>
        );
    });



    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-5 align-self-center">
                        <h4 className="page-title">Review</h4>
                    </div>

                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">List Review </h4>
                                <input
                                    onChange={search}
                                    ref={input}
                                    class="input-search"
                                    placeholder="Search..."
                                    // onChange={e =>{ setsearchValue(e.target.value)}}
                                    value={searchValue}></input>
                                <button className="btn-search " onClick={search}><i className="fa fa-search"></i></button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Star</th>
                                        <th scope="col">Content</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Product</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {renderReviewList.length > 0
                                        ? renderReviewList
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
