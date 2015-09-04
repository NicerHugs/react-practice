var ProductRow = React.createClass({
  render: function() {
    var className;
    if (!this.props.stocked) {
      className = 'out-of-stock';
    }
    return (
      <tr className={className}>
        <td>{this.props.name}</td>
        <td>{this.props.price}</td>
      </tr>
    );
  }
});

var ProductCategoryRow = React.createClass({
  render: function() {
    return (
      <tr>
        <th colSpan="2">{this.props.category}</th>
      </tr>
    );
  }
});

var ProductTable = React.createClass({
  buildRows: function() {
    var completeProductList = this.props.completeProductList;
    var availProductList = completeProductList.filter(function(product) {return product.stocked});
    var categories;
    if (this.props.filterByStocked) {
      categories = _.groupBy(availProductList, 'category');
    } else {
      categories = _.groupBy(completeProductList, 'category');
    }
    var filterBy = this.props.searchText;
    var rows = [];
    _.forEach(categories, function(category, key) {
      rows.push(<ProductCategoryRow category={key}/>)
      category.forEach(function(product) {
        if (product.name.toLowerCase().match(filterBy)) {
          rows.push(<ProductRow price={product.price} name={product.name} stocked={product.stocked}/>);
        }
      });
    });
    return rows;
  },
  render: function() {
    var rows = this.buildRows();
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
});

var SearchBar = React.createClass({
  handleChange: function(e) {
    this.props.onFilterChange({
      term: this.refs.productSearchTerm.getDOMNode().value,
      inStockOnly: this.refs.filterByStocked.getDOMNode().checked
    });
  },
  render: function() {
    return (
      <form>
        <input
          ref="productSearchTerm"
          className="search-box"
          type="text"
          placeholder="Search..."
          value={this.props.searchText}
          onChange={this.handleChange}/>
        <input
          ref="filterByStocked"
          type="checkbox"
          checked={this.props.filterByStocked}
          onChange={this.handleChange}/>
        <span>Only show products in stock</span>
      </form>
    )
  }
});

var FilterableProductTable = React.createClass({
  loadProducts: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({products: data});
      }.bind(this),
      error: function(xhr, status, error) {
        console.error(status, error);
      }.bind(this)
    })
  },
  handleFilterChange: function(filterState) {
    this.setState({
      filterByStocked: filterState.inStockOnly,
      searchText: filterState.term
    });
  },
  updateSearchTerm: function(term) {
  },
  componentDidMount: function() {
    this.loadProducts();
  },
  onFilterByStocked: function() {},
  onUserSearchTerm: function() {},
  getInitialState: function() {
    return {
      products: [],
      searchText: '',
      filterByStocked: false
    };
  },
  render: function() {
    return (
      <div className="filterable-product-table">
        <SearchBar
          filterByStocked={this.state.filterByStocked}
          searchText={this.state.searchText}
          onFilterChange={this.handleFilterChange}/>
        <ProductTable
          completeProductList={this.state.products}
          filterByStocked={this.state.filterByStocked}
          searchText={this.state.searchText}/>
      </div>
    )
  }
});

React.render(<FilterableProductTable url="json/products.json" />, document.getElementById('products'));
