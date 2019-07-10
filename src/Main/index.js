import React, { Component } from 'react'
import Form from '../Form'
import BlogPost from '../BlogPost'
import Button from '../Button'

export default class Main extends Component {
	state = {
		isPosting: false,
		posts: []
	}

	componentDidMount(){
		getPosts().then(results => this.setState({
			posts: results
		}))
	}
	
	handleClick = (event) => {
		this.setState({
			isPosting: !this.state.isPosting
		})
	}
	
	handleAddPost = ({ title, author, post }) => {
		const options = {
			method: 'POST',
			headers : {
				"content-type" : "application/json"
			},
			body: JSON.stringify({title, author, post})
		}

		async function createPosts(){
			try{
				console.log(options)
				const sendPost = await fetch('http://localhost:8000/api/post', options)
				const postReults = await sendPost.json()
				return await postReults
			} catch (error){
				console.log(error)
			}
		}

		createPosts().then(result => this.setState({
			posts: [{...result}, ...this.state.posts]
		}))

		// this.setState({
		// 	posts: [{ title, author, post }, ...this.state.posts]
		// })
	}
	
	handleDeletePost = postIdx => {
		// We cannot mutate state directly
		const newStateArray = this.state.posts.filter(
			(elem, idx) => idx !== postIdx
			)
			
			this.setState({ posts: newStateArray })
		}
		
		render() {
			/**
			 * *TODO: extract this as a component to another file
			 */
			
			const postsList = this.state.posts.map((post, index) => {
				return (
					<BlogPost
					key={index}
					{...post}
					handleDeletePost={this.handleDeletePost}
					index={index}
					/>
					)
				})
				
				return (
					<div>
				<header>
					<h1>Party Blog</h1>
				</header>
				<section>
					<Button handleClick={this.handleClick} type={"Add New Post"}/>
					{!!this.state.isPosting ? (
						<Form handleAddPost={this.handleAddPost} />
						) : null}
					<ul>{postsList}</ul>
				</section>
			</div>
		)
	}
}

async function getPosts(){
	try{
		const fetchPosts = await fetch('http://localhost:8000/api/posts')
		const data = fetchPosts.json()
		return await data
	} catch(error) {
		console.log(error)
	}
}
console.log(getPosts())