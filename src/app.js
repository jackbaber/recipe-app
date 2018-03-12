import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import { Button, Card, Form, Grid, Icon, Item, Message, Segment } from 'semantic-ui-react';
import 'tachyons';
import { CSSTransitionGroup } from 'react-transition-group';

const recipes = [
    {
        id: 0,
        title: '',
        description: 'a lovely little meal',
        ingredients: ['chicken', 'vegetables', 'gravy']
    },
    {
        id: 1,
        title: 'Salmon and avocado',
        description: 'a healthy luncheon',
        ingredients: ['salmon', 'avocado']
    },
    {
        id: 2,
        title: 'Scrambled eggs and nuts',
        description: 'start your day the right way',
        ingredients: ['eggs', 'coconut oil', 'walnuts']
    },

]

class RecipeDashboard extends React.Component {
    state = {
        recipes: recipes,
    }
    componentDidMount(){
        try {
            const json = localStorage.getItem('recipes')
            const recipes = JSON.parse(json)

            if(recipes){
                this.setState(() => ({ recipes }))
            }

        } catch(e){
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.recipes.length !== this.state.recipes.length){
            const json = JSON.stringify(this.state.recipes)
            localStorage.setItem('recipes', json)
        }
    }

    handleDeleteClick = (recipeId) => {
        this.deleteRecipe(recipeId)
    }

    deleteRecipe = (recipeId) => {
        this.setState({
            recipes: this.state.recipes.filter(r => r.id !== recipeId)
        })
    }
    handleEditFormSubmit = (recipeData) => {
        this.updateRecipe(recipeData)
    }

    updateRecipe = (recipeData) => {
        this.setState({
            recipes: this.state.recipes.map((recipe) => {
                if(recipe.id === recipeData.id){
                    return Object.assign({}, recipe, {
                        title: recipeData.title,
                        description: recipeData.description, 
                        ingredients: recipeData.ingredients,
                    })
                } else {
                    return recipe
                }
            })
        })
    }
    handleCreateFormSubmit = (recipeData) => {
        this.createRecipe(recipeData)
    }

    createRecipe = (recipeData) => {
        const r = {
            id: this.state.recipes.length,
            title: recipeData.title,
            description: recipeData.description,
            ingredients: recipeData.ingredients,
        }
        this.setState({
            recipes: this.state.recipes.concat(r)
        })
    }



    render(){
        const component = (
            <Grid centered>
                <Grid.Column width={9} className="mt5">
                    <ToggableRecipeForm
                        onFormSubmit={this.handleCreateFormSubmit}
                    />
                    <EditableRecipeList
                        recipes={this.state.recipes}
                        onDeleteClick={this.handleDeleteClick}
                        onFormSubmit={this.handleEditFormSubmit}
                        // addIngredient={this.handleAddIngredient}
                    />
                    
                </Grid.Column>
            </Grid>
        )
        return (
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}
            >
                {component}
            </CSSTransitionGroup>
        )
    }
}

class EditableRecipeList extends React.Component {

    render(){
        const recipes = this.props.recipes.map((recipe) => (
            <EditableRecipe
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                description={recipe.description}
                ingredients={recipe.ingredients}
                onDeleteClick={this.props.onDeleteClick}
                onFormSubmit={this.props.onFormSubmit}
                // addIngredient={this.props.addIngredient}
            />
        ))
        return (
            <div id="recipes">
                {recipes}
            </div>

        )
    }
}

class EditableRecipe extends React.Component {
    state = {
        editFormOpen: false,
    }
    handleEditClick = () => {
        this.openForm()
    }
    handleFormClose = () => {
        this.closeForm()
    }
    openForm = () => {
        this.setState({ editFormOpen: true })
    }
    closeForm = () => {
        this.setState({ editFormOpen: false })
    }
    handleSubmit = (recipeData) => {
        this.props.onFormSubmit(recipeData)
        this.closeForm()
    }

    render(){
        if(this.state.editFormOpen){
            return (
                <RecipeForm
                    id={this.props.id}
                    title={this.props.title}
                    description={this.props.description}
                    ingredients={this.props.ingredients}
                    onFormClose={this.handleFormClose}
                    onFormSubmit={this.handleSubmit}
                    // addIngredient={this.props.addIngredient}
                />
            )
        } else {
            return (
                <Recipe
                    id={this.props.id}
                    title={this.props.title}
                    description={this.props.description}
                    ingredients={this.props.ingredients}
                    onEditClick={this.handleEditClick}
                    onDeleteClick={this.props.onDeleteClick}
                />
            )
        }
    }
}

class RecipeForm extends React.Component {
    state = {
        title: this.props.title || "",
        description: this.props.description || "",
        ingredients: this.props.ingredients || [],
        formError: false,

    }
    handleTitleChange = (event) => {
        this.setState({ title: event.target.value })

    }
    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value })
    }
    handleIngredientChange = (event) => {
        let index = event.target.id
        console.log(index)
        let updatedIngredients = this.state.ingredients.slice()
        updatedIngredients[index] = event.target.value
        this.setState({ ingredients: updatedIngredients })
    }
    handleAddIngredient = (newIngredient) => {
        this.setState({ ingredients: this.state.ingredients.concat(newIngredient)})
    }
    handleDeleteIngredient = (event) => {
        let index = event.target.id 
        let updatedIngredients = this.state.ingredients.slice()
        updatedIngredients.splice(index, 1)
        this.setState({ ingredients : updatedIngredients })
    }

    handleSubmit = () => {
        if(this.state.title){
            this.props.onFormSubmit({
                id: this.props.id,
                title: this.state.title,
                description: this.state.description,
                ingredients: this.state.ingredients,
            })
        } else {
            console.log("error")
            this.setState({ formError: true })
        }
       
    }

    render(){
        return (
            <Card centered fluid>
            
                <div className="content">
                <Grid celled="internally">
                <Grid.Column width={12}>
                    <Form error={this.state.formError}>
                        <Form.Field>
                            <label>Recipe</label>
                            <input 
                                type="text"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                            <Message
                                error
                                header='Give your recipe a title to save it :-D'
                                size='mini'
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Description</label>
                            <input 
                                type="text"
                                value={this.state.description}
                                onChange={this.handleDescriptionChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Ingredients</label>
                            {this.state.ingredients ?
                                this.state.ingredients.map((ingredient, index) => (
                                <div className="flex" key={index} id={index}>
                                    <input
                                        type="text"
                                        value={ingredient}
                                        id={index}
                                        onChange={this.handleIngredientChange}
                                    />
                                    <Button icon onClick={this.handleDeleteIngredient} id={index}>
                                        <Icon name="trash" id={index}/>
                                    </Button>
                                </div>
                            )) : "---"}

                            
                        </Form.Field>
                        <div className="ui buttons">
                            <button 
                                className="ui button"
                                onClick={this.handleSubmit}
                            >
                                Confirm
                            </button>
                            <div className="or"></div>
                            <button 
                                className="ui button"
                                onClick={this.props.onFormClose}
                            >
                                Go back
                            </button>
                        </div>
                    </Form>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign="center">
                        <Grid.Row className="mt5 mid-gray">
                            <h1>{this.state.title ? this.state.title : "New Recipe"}</h1>
                        </Grid.Row>
                        <Grid.Row className="mt5 mb4">
                            <AddIngredientButton
                                addIngredient={this.handleAddIngredient}
                                id={this.props.id}
                            />
                        </Grid.Row>
                    </Grid.Column>
                    </Grid>
                    
                </div>
            </Card>
        )
    }
}

class AddIngredientButton extends React.Component {
    state = {
        isOpen: false,
        newIngredient: "",
    }

    // handleAddIngredient = () => {
    //     this.props.addIngredient( {recipeId: this.props.id, newIngredient: this.state.newIngredient} )
    // }

    handleNewIngredientChange = (event) => {
        this.setState({ newIngredient: event.target.value })
    }

    handleAddIngredient = (event) => {
        if(this.state.newIngredient){
            this.props.addIngredient(this.state.newIngredient)
        }
        this.setState({ newIngredient: "" })
    }
    handleOpen = () => {
        this.setState({ isOpen: true })
    }
  
    render(){
        if(this.state.isOpen){
            return (
                <Form onSubmit={this.handleAddIngredient}>
                   
                        <Form.Input 
                            placeholder="add ingredient here..."
                            value={this.state.newIngredient}
                            onChange={this.handleNewIngredientChange}
                        />
                        <Form.Button 
                            content="add"
                        />
                 
                </Form>
            )
        } else {
            return ( 
                <Button onClick={this.handleOpen}>
                    Add ingredient <Icon name="plus"/>
                </Button>
            )
        }
    }
}

class ToggableRecipeForm extends React.Component {
    state = {
        isOpen: false,
    }
    handleFormOpen = () => {
        this.setState({ isOpen: true })
    }
    handleFormClose = () => {
        this.setState({ isOpen: false })
    }
    handleFormSubmit = (recipeData) => {
        this.props.onFormSubmit(recipeData)
        this.setState({ isOpen: false })
    }
    render(){
        if(this.state.isOpen){
            return (
                <CSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={false}
                    transitionLeave={false}
                >
                    <RecipeForm
                        onFormClose={this.handleFormClose}
                        onFormSubmit={this.handleFormSubmit}
                    />
                </CSSTransitionGroup>
            )
        } else {
            return (
                <Segment>
                    <Button 
                        fluid
                        onClick={this.handleFormOpen}
                    >
                        Add new recipe
                    </Button>
                </Segment>
            )
        }
    }
   
}

class Recipe extends React.Component {
    handleDeleteClick = () => {
        this.props.onDeleteClick(this.props.id)
    }
    render(){
        return (
            <Card fluid>
                    <Grid celled="internally">
                        <Grid.Column width={10}>
                            <Card.Content>
                                <Card.Header className="f3 b ma2 mid-gray">
                                    {this.props.title}
                                </Card.Header>    
                                <Card.Meta className="f4 i mt2 mb3 mh3">
                                    {this.props.description}
                                </Card.Meta>
                            </Card.Content>
                        </Grid.Column>
                        <Grid.Column width={6} textAlign="center">
                            <Button 
                                circular icon="pencil" 
                                size="massive"
                                onClick={this.props.onEditClick}
                            />
                            <Button 
                                circular 
                                icon="trash" 
                                size="massive"
                                onClick={this.handleDeleteClick}
                            />
                        </Grid.Column>
                    </Grid>
             
            </Card>
        )
    }
}

ReactDOM.render(<RecipeDashboard/>, document.getElementById('app'));


