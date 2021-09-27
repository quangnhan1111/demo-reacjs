import React , {useState , useEffect, useRef} from 'react'
import {useGlobalContext} from "../../context/LoginContext"
import {useHistory } from 'react-router-dom';
import paginate from "../../utils/helper";
import Api from "../../Config/config"
// import { success } from '../Helper/Notification';
export default function Products() {
    const history =useHistory();
    const [ListProduct , setListProduct] = useState([]);
    const [dataPaginate, setDataPaginate] = useState([])
    const [data, setData] = useState([])

    const {checklogin, IsLogin} = useGlobalContext();
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)

    const [filters, setFilters] = useState({
        page: 0,
        id : 0
    })
    // var count = 0
    const [pagination, setPagination] = useState({
        page: 0,
        limit: 5,
        totalPages: 1
    })

    function handlePageChange(newPage) {
        setFilters({ ...filters ,
            page: newPage
        })
    }



    var token = {
        headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    }

    const input = useRef("")
    // useEffect(() => {
    //     input.current.focus();
    // }, [])

    useEffect(() => {
        function getData () {
            checklogin();
             Api.get('product?page='+filters.page, token).then((response)=> {
                 console.log(response.data.content)
                 setData(response.data.content);
                // setPagination({
                //     page: response.data.pageIndex,
                //     totalPages: response.data.totalPage
                // })
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
            setListProduct(paginate(data)[page]);
            console.log(ListProduct)
            //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        }
        else {
            setDataPaginate([])
            setListProduct([])
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


    function deleteproduct (id) {
        Api.delete('product/'+id, token).then((response)=> {
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
            Api.get('product?search='+searchValue, token).then((response)=> {
                console.log(response.data)
                setListProduct(response.data.content);
            }).catch((error) =>{
            });

            const newProductList = ListProduct.filter((product) => {
                return Object.values(product)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
            });
            setSearchResults(newProductList);
        } else {
            setSearchResults(ListProduct);
        }
        // showAlert(true, 'success', 'search value');
    };


    function search (){
        searchHandler(input.current.value)
    }

    const list = searchValue.length < 1 ? ListProduct : searchResults
    const renderProductList = list.map((product, index) => {
        return (
            <tr key= {index}>
                <th scope="row">{product.id}</th>
                <td>{product.name}</td>
                <td>{product.number}</td>
                <td>{product.name_Size}</td>
                <td><a href={product.link} target="_blank">click in here</a></td>
                <td>
                    <button
                        className="btn btn-success"
                        onClick ={ e=> {history.push(`/product/${product.id}`)}}>View
                    </button>
                    <button
                        className="btn btn-info" onClick ={ e=> {history.push(`/editproduct/${product.id}`)}}>Edit
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick = {deleteproduct.bind(this, product.id)}>Delete
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
                            <h4 className="page-title">Product</h4>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">List Product </h4>
                                        <input
                                            ref={input}
                                            placeholder="search"
                                            onChange={search}
                                            // onChange={e =>{ setsearchValue(e.target.value)}}
                                            value={searchValue}
                                            className="input-search">
                                        </input>
                                        {/*<button onClick={search}className="btn-search ">sss<i  className="fa fa-search" aria-hidden="true"></i></button>*/}
                                        <button className="btn1 btn btn-success" onClick ={ e=> {history.push("/newproduct")}}>New</button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th scope="col">Id</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Number</th>
                                                <th scope="col">Size</th>
                                                <th scope="col">Image</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {renderProductList.length > 0
                                                ? renderProductList
                                                : "No Product available"}

                                            </tbody>
                                        </table>
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
                    </div>
                </div>
            )}
        </>
    )
}
