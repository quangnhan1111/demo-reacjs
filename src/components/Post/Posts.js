import React , {useState , useEffect, useContext} from 'react'
import API from "../../Config/config"
import paginate from "../../utils/helper";
import { Link , useHistory } from 'react-router-dom'
import queryString from 'query-string'
import {useGlobalContext} from "../../context/LoginContext"
import { useLocation } from "react-router-dom";
// import { success } from '../Helper/Notification';
function Posts() {
    const location = useLocation();
    const history = useHistory();
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [ListPost , setListPost] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const {checklogin, IsLogin} = useGlobalContext();
    const [alert, setAlert] = useState({
        report: ""
    })

    const [filters, setFilters] = useState({
        page: 0,
        post_edit_id: 0
    })

    var token = {
        headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    }

    useEffect(() => {

        async function getData () {
            let token = {
                headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
            }
            checklogin();
            const paramsString = queryString.stringify(filters)
            const requestUrl = `post?${paramsString}`
            API.get(requestUrl,token).then((response)=> {
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
            setListPost(paginate(data)[page]);
            console.log(ListPost)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListPost([])
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

    const deletePost = (e) => {
        e.preventDefault()
        let id = e.target.id.toString()
        // console.log(id)

        API.delete('post/' + id, token)
            .then(response => {
                setFilters({...filters, post_edit_id: id})
                console.log(response.data)
                // success('Deleted post');
            })
            .catch(errors => {
                console.log(errors)
            })
    }


    const list = ListPost
    const renderPostList = list.map((Post, index) => {
        return (
            <tr key = {index}>
                <th scope="row">{Post.id}</th>
                {/* <td>{Post.name}</td> */}
                <td>{Post.title}</td>
                {/* <td></td> */}
                <td ><div className="synopsis-content">{Post.content}</div></td>
                <td ><a href={Post.link} target="_blank">Click in here</a></td>
                <td><button className="btn btn-success" onClick ={ e => {history.push(`/view-post/${Post.id}`)}}>View</button> <button
                    className="btn btn-info" onClick ={ e => {history.push(`/edit-post/${Post.id}`)}}>Edit</button> <button
                    className="btn btn-danger" id = {Post.id} onClick={deletePost}>Delete</button></td>

            </tr>
        );
    });

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">

                <div className="col-5 align-self-center">
                    <h4 className="page-title">Post</h4>
                </div>

            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">List Post
                                    <button className="btn1 btn btn-success" onClick ={ e=> {history.push("/add-post")}} >New</button></h4>
                            </div>
                            {(alert.report != "") ?
                                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                    {alert.report}
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div> : <div></div>
                            }
                            <div className="table-responsive">
                                <table className="table table-hover" style = {tableStyle}>
                                    <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        {/* <th scope="col">Name</th> */}
                                        <th scope="col" style = {titleStyle}>Title</th>
                                        <th scope="col" style = {thStyle}>Content</th>
                                        <th scope="col">Image</th>
                                        <th scope="col" style = {thStyle}>Action</th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                        {renderPostList.length > 0
                                        ? renderPostList
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

export default Posts

const tableStyle = {
    // border: 1px solid black,
    // table-layout: fixed,
    // width: '200px',
}

const thStyle = {
    width: '300px',
    overflow: 'hidden'
}

const titleStyle = {
    width: '200px',
    overflow: 'hidden'
}
