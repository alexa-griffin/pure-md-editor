import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Radium from 'radium'

import api from "../assets/js/api.js"
import themes from "../assets/js/theme.js"

import SearchBar from "./SearchBar.js"
import EmoteError from "./EmoteError.js"


class ProjectList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: api.getProjects() || {},
      filteredList: api.getProjects() || {},
      theme: api.getSetting("theme")
    }
    this.style = {
      noteList: {

      },
      listItem: {
        color: themes[this.state.theme].color,
        backgroundColor: themes[this.state.theme].bgAlt,
        borderLeft: themes[this.state.theme].accent + " 8px solid",
        padding: "16px 32px",
        transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
        ':hover': {
          backgroundColor: themes[this.state.theme].accent,

        }
      },
      gridItem: {
        margin: "8px auto",
        width: "90%",
        maxWidth: "960px",
        padding: "8px 16px",
      },
      header: {
        width: "100%",
        color: themes[this.state.theme].color,
        padding: "16px 32px",
        marginBottom: "16px",
        fontSize: "32px",
      },
      placeholder: {
        textAlign: "center",
        opacity: "0.4",
        color: themes[this.state.theme].color,
        fontSize: "48px",
        fontWeight: "300"
      },
      placeholderLink: {
        transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
        ":hover": {
          opacity: "1",

        }
      }
    }
  }

  filterList(e) {
    let filteredList = {}
    for(let key in this.state.list) {
      if(this.state.list[key].name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
        filteredList[key] = this.state.list[key]
      }
    }
    this.setState({filteredList})
  }

  deleteProject(e, id) {
    console.log(id);
  }

  render() {
    let list = []
    for(let key in this.state.filteredList) {
      list.push((
        <div className="list-item" key={ list.length } >
          <Link to={ "/app/edit/" + key + "/default/" }>
            <p style={{ ...this.style.gridItem, ...this.style.listItem }} key={"RADIUM_" + key + list.length}>
              <span>{ key }</span>
              <div className="actions">
                <button onClick={ this.deleteProject.bind(this, key) }>
                  <i class="material-icons">delete_forever</i>
                </button>
              </div>
            </p>
          </Link>
        </div>
      ))
    }

    return (
      <div className={"note-list " + this.props.className}
           style={{...this.props.style, ...this.style.noteList}}>
       <header style={ this.style.header }>
         <h1 style={{ fontWeight: "300" }}>Projects</h1>
       </header>
        <SearchBar onChange={ this.filterList.bind(this) }
                   theme={ this.state.theme }
                   style={ this.style.gridItem }/>
        {(list.length > 0 && list) || (
          <EmoteError style={ this.style.placeholder }>
            <p style={this.style.placeholder}>no projects found</p>
            <br />
            <Link to="/app/edit/new/default">
              <p style={{ ...this.style.placeholder,
                          ...this.style.placeholderLink }}>
                why not create one?
              </p>
            </Link>
          </EmoteError>
        )}
      </div>
    );
  }
}


export default Radium(ProjectList);
