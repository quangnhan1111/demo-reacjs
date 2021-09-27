import React, {useState, useEffect, useContext, useRef} from 'react'
import API from "../../Config/config"
import { Link, useHistory } from 'react-router-dom'
import paginate from "../../utils/helper";
import queryString from 'query-string'
import {useGlobalContext} from "../../context/LoginContext"
import { useLocation } from "react-router-dom";
// import { success } from '../Helper/Notification';
export default function Category() {
    const {checklogin, IsLogin} = useGlobalContext();
    const [alert, setAlert] = useState({
        report: ""
    })

    const [filters, setFilters] = useState({
        page: 0,
        category_edit_id: 0
    })
    const history = useHistory()
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [ListCategory , setListCategory] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)

    let token = {
        headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    }
    useEffect(() => {
        async function getData () {
            let token = {
                headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
            }
            checklogin();
            const paramsString = queryString.stringify(filters)
            const requestUrl = `category?${paramsString}`
            await API.get(requestUrl,token).then((response)=> {
                setData(response.data.content);
                setLoading(false)
            }).catch((error) =>{
            });
        }
        getData();
    }, [filters])

    // function handlePageChange(newPage) {
    //
    //     setFilters({
    //         page: newPage
    //     })
    // }

    useEffect(() => {
        if (loading) return
        if(data.length>0){
            console.log((data))
            setDataPaginate(paginate(data))
            // console.log(dataPaginate)
            setListCategory(paginate(data)[page]);
            console.log(ListCategory)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListCategory([])
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

    const deleteCategory = (e) => {
        e.preventDefault()
        let id = e.target.id.toString()
        // console.log(id)

        API.delete('category/' + id,token)
            .then(response => {
                setFilters({...filters, category_edit_id: id})
                // console.log(response.data)
                // success('Deleted category');
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
            API.get('category?search='+searchValue, token).then((response)=> {
                // console.log(response.data)
                setListCategory(response.data.content);
            }).catch((error) =>{
            });

            const newCategoryList = ListCategory.filter((category) => {
                return Object.values(category)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
            });
            setSearchResults(newCategoryList);
        } else {
            setSearchResults(ListCategory);
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

    const list = searchValue.length < 1 ? ListCategory : searchResults
    const renderCategoryList = list.map((Category, index) => {
        return (
            <tr key = {index}>
                <th scope="row">{Category.id}</th>
                <td>{Category.name}</td>

                <td>
                    <button
                        className="btn btn-info"
                        onClick ={ e => {history.push(`/editcategory/${Category.id}`)}}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger"
                        id = {Category.id}
                        onClick={deleteCategory}
                    >Delete
                    </button>
                </td>
            </tr>
        );
    });


    return (
        <>
        {(IsLogin === false ) ? (
                <div className="page-wrapper">
                    <h3 style={{textAlign : "center"}}>You need login</h3>
                </div>
            ) : (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="col-5 align-self-center">
                    <h4 className="page-title">Category</h4>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">List Category<button className="btn1 btn btn-success" onClick ={e => {history.push("/addcategory")}} >New</button></h4>
                                <input
                                    className="input-search"
                                    placeholder="Search..."
                                    // onChange={e =>{ setsearchValue(e.target.value)}}
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
                                        <th scope="col">Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {renderCategoryList.length > 0
                                        ? renderCategoryList
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
