import React from 'react';
import axios from 'axios';
import host from '../../common/Host'
const CategoryCard = (props) => (
    <div onClick={props.onClick}>{props.category}</div>

)


const DrinkCard = (props) => ( // how to onclick and how to put everything in div in css
    <div className="drink_card">

        <div className="drink-info-container">
            <div id='drinkname'>{props.drinkname}</div>
            <div id='description'>{props.description}</div>
            <div id='tea-price'>${props.price}</div>
        </div>

        <div style={{ display: 'flex' }}>
            <div style={{ color: '#EB5757', fontWeight: 'bold' }} id='rate'><i class="fas fa-star"></i> {props.rate.toFixed(1)} / 5.0 </div>
            <div><img src={props.image} style={{ 'width': '10rem', 'height': '10rem', 'objectFit': 'cover' }} /></div>

        </div>

    </div>

)


class Overview extends React.Component {

    constructor(props) {
        super();
        this.state = {
            categories: [],
            products: [],
            category: 1,
        }
    }

    componentDidMount() {
        axios.get(host+'api/category/')
            .then((response) => {
                this.setState({
                    categories: response.data,
                    category: response.data[0].order,
                });
            });


        axios.get(host+'api/product/')
            .then((response) => {
                this.setState({ products: response.data });
            });
    }

    CardList() {
        if (this.state.products != []) {
            return (
                this.state.products.map((result, index) => {
                    if (result.category.order == this.state.category) {
                        return (
                            <DrinkCard
                                image={result.image}
                                key={index}
                                drinkname={result.name}
                                description={result.description}
                                price={result.list_price}
                                rate={result.ratings}
                                onClickAdd={() => this.AddHandler(result)}
                                onClickDel={() => this.DelHandler(result)}
                            ></DrinkCard>
                        )
                    }

                })
            )
        }
    }

    CatergoryHandler(index) {
        this.setState({
            category: index,
        })
    }

    CatergoryList() {
        // console.log("categoriessss:",this.state.categories)
        return (
            this.state.categories.map((category, index) => (
                <div className={category.order == this.state.category ? "catergory_card active" : "catergory_card"}
                    onClick={() => this.CatergoryHandler(category.order)}
                >
                    <CategoryCard
                        key={index}
                        category={category.name}
                    ></CategoryCard>
                </div>

            ))

        )
    }

    render() {
        return (
            <div className="preview-page">
                {/* <h1 className='page-name'>Overview</h1> */}
                {/* <br></br>
                <h4>Categories:</h4> */}
                {/* <ul>
                    {this.state.categories.map(category =>
                        <li>{category.name}</li>)}
                </ul> */}
                <div className='catergory_slide'>
                    {this.CatergoryList()}
                </div>
                <div className='menu_slide'>
                    {this.CardList()}
                </div>
            </div>
        )
    }

}



export default Overview;