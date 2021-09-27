import React, {useState, useEffect, useContext, useRef} from 'react'
import paginate from "../../utils/helper";
import { useHistory } from 'react-router-dom';
import Api from "../../Config/config"
import {useGlobalContext} from "../../context/LoginContext"
import API from "../../Config/config";
// import { success } from '../Helper/Notification';
export default function Brands() {
    var token = {
        headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    }
    const {checklogin, IsLogin} = useGlobalContext();
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])
    const [ListBrand , setListBrand] = useState([]);
    const history = useHistory();
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [filters, setFilters] = useState({
        page: 0,
        id : 0
    })

    useEffect(() => {
        checklogin();
        Api.get('brand?page='+filters.page, token).then((response)=> {
            setData(response.data.content);
            setLoading(false)
        }).catch((error) =>{

        });
    }, [filters])

    useEffect(() => {
        if (loading) return
        if(data.length>0){
            console.log((data))
            setDataPaginate(paginate(data))
            // console.log(dataPaginate)
            setListBrand(paginate(data)[page]);
            console.log(ListBrand)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListBrand([])
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

    function deletebrand (id) {
        Api.delete('brand/'+id, token).then((response)=> {
            setFilters({...filters , id :id });
            // success('Deleted category');
        }).catch((error) =>{

        });
    }

    const [searchValue, setsearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchTerm) => {
        setsearchValue(searchTerm);
        if (searchValue !== "") {
            Api.get('brand?search='+searchValue, token).then((response)=> {
                // console.log(response.data)
                setListBrand(response.data.content);
            }).catch((error) =>{
            });

            const newBrandList = ListBrand.filter((category) => {
                return Object.values(category)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
            });
            setSearchResults(newBrandList);
        } else {
            setSearchResults(ListBrand);
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

    const list = searchValue.length < 1 ? ListBrand : searchResults
    const renderBrandList = list.map((brand, index) => {
        return (
            <tr key = {index}>
                <th scope="row">{brand.id}</th>
                <td>{brand.name}</td>
                <td>
                    <button className="btn btn-info"  onClick ={e => {history.push(`/editbrand/${brand.id}`)}}>Edit</button>
                    <button className="btn btn-danger" onClick={deletebrand.bind(this, brand.id)}>Delete</button></td>

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
                            <h4 className="page-title">Brand</h4>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">List Brand</h4>
                                        <input
                                            placeholder="search"
                                            onChange={search}
                                            value={searchValue}
                                          
                                            ref={input}
                                        >
                                        </input>
                                        {/*<button onClick={search} className="btn-search "><i  className="fa fa-search" aria-hidden="true"></i></button>*/}
                                        <button className="btn1 btn btn-success" onClick ={e => {history.push("/newbrand")}}>new</button>
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
                                                {renderBrandList.length > 0
                                                ? renderBrandList
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
