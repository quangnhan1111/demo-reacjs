import React, {useState, useEffect, useContext, useRef} from 'react'
import {useHistory } from 'react-router-dom';
import Api from "../../Config/config"
import paginate from "../../utils/helper";
import queryString from 'query-string'
import {useGlobalContext} from "../../context/LoginContext"
// import { success } from '../Helper/Notification';
export default function Images() {
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [Listimage , setListimage] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const history = useHistory();
    const {checklogin, IsLogin} = useGlobalContext();
    var token =  {headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }
    const [filters, setFilters] = useState({
        page: 0,
        id : 0
    })
    useEffect(() => {

        function getData() {
            checklogin()
            Api.get('image?page='+filters.page, token).then((response)=> {
                setData(response.data.content);
                setLoading(false)
            }).catch((error) =>{

            });
        }
        getData()
    }, [filters])

    useEffect(() => {
        if (loading) return
        if(data.length>0){
            console.log((data))
            setDataPaginate(paginate(data))
            // console.log(dataPaginate)
            setListimage(paginate(data)[page]);
            console.log(Listimage)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListimage([])
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

    function deleteimage (id) {
        Api.delete(`image/${id}`,token).then((response)=> {
            setFilters({...filters, id :id});
            // success('Deleted category');
        }).catch((error) =>{
        });
    }

    const [searchValue, setsearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchTerm) => {
        setsearchValue(searchTerm);
        if (searchValue !== "") {
            Api.get('image?search='+searchValue, token).then((response)=> {
                console.log(response.data)
                setListimage(response.data.content);
            }).catch((error) =>{
            });

            const newImageList = Listimage.filter((image) => {
                return Object.values(image)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
            });
            setSearchResults(newImageList)
        } else {
            setSearchResults(Listimage)
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

    const list = searchValue.length < 1 ? Listimage : searchResults
    const renderImageList = list.map((image, index) => {
        return (
            <tr key = {index}>
                <th scope="row">{image.id}</th>
                <td>{image.name}</td>
                <td><a href={image.link} target="_blank"> click in here </a>  </td>
                <td><button className="btn btn-info"  onClick ={e => {history.push(`/editimage/${image.id}`)}}>Edit</button> <button className="btn btn-danger" onClick={deleteimage.bind(this,image.id)}>Delete</button></td>
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
                            <h4 className="page-title">Image</h4>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">List image </h4>
                                        <input
                                            onChange={search}
                                            ref={input}
                                            placeholder="search"
                                            value={searchValue}
                                            className="input-search"
                                        ></input>
                                        <button className="btn1 btn btn-success" onClick ={e => {history.push("/newimage")}}>new</button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th scope="col">Id</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Link</th>
                                                <th scope="col">Action</th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                                {renderImageList.length > 0
                                                ? renderImageList
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
