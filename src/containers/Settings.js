import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { StyleSheet, css } from 'aphrodite/no-important';

import RadioCluster from "../components/RadioCluster.js"
import ToggleButton from "../components/ToggleButton.js"

import api from "../assets/js/api.js"
import { themes } from "../assets/js/theme.js"

export default class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: api.getSettings(),
      shouldRedirect: false
    }
    const theme = this.state.settings.theme
    this.style = StyleSheet.create({
      headers: {
        fontWeight: 300,
        marginBottom: "1em",
      },
      h1: {
        fontSize: "52px"
      },
      h2: {
        fontSize: "32px"
      },
      h3: {
        fontSize: "16px"
      },
      container: {
        color: themes[theme].color,
        padding: "16px",
        width: "90%",
        maxWidth: "720px",
        margin: "0 auto"
      },
      option: {
        marginBottom: "48px"
      },
      saveButton: {
        backgroundColor: themes[theme].accent,
        position: "fixed",
        bottom: "16px",
        right: "16px",
        padding: "8px 16px",
        border: themes[theme].color
      },
      input: {
        borderBottom: "4px solid " + themes[theme].accent,
        padding: "4px 8px",
        backgroundColor: "transparent",
        color: themes[theme].color,
        display: "inline"
      },
      p: {
        opacity: "0.6",
        fontSize: "12px",
        display: "inline-block"
      },
      toggleContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "8px"
      },
      toggleLabel: {
        marginRight: "32px",
        width: "300px"
      },
      innerContainer: {
        marginBottom: "16px",
      }
    })
  }

  handleOptionChange(e, name) {
    const settings = {...this.state.settings}
    settings[name] = e.target.name
    this.setState({ settings })
  }

  handleText(e) {
    const settings = {...this.state.settings}
    settings[e.name] = e.target.value;
    this.setState({ settings })
  }

  handleSave(e) {
    const settings = this.state.settings
    for(let setting in settings) {
      if(settings[setting] === "") {
        settings[setting] = api.getSetting(setting)
      }
    }
    api.setSettings(settings);
    this.setState({shouldRedirect: true})
  }

  handleNumChange(e) {
    const settings = {...this.state.settings}
    if(e.target.value >= e.target.min && e.target.value <= e.target.max) {
      settings[e.target.name] = e.target.value
    } else if(e.target.value === "") {
      settings[e.target.name] = ""
    } else {
      e.target.value = settings[e.target.name]
    }
    this.setState({ settings })
  }

  handleToggleChange(e, name) {
    const settings = {...this.state.settings}
    settings[name] = e.target.checked;
    this.setState({ settings })
  }

  render() {
    if(this.state.shouldRedirect) {
      // TODO: make this better and not make a bunch of half rendered garbage
      window.location.reload()

      return (
        <Redirect to="/app/projects/" />
      )
    }

    return (
      <div className={ css(this.style.container) }>
        <h1 className={ css(this.style.headers) }>Settings</h1>
        <div className={ css(this.style.option) }>
          <h2 className={ css(this.style.headers) }>Theme</h2>
          <div>
            <RadioCluster onChange={ (e) => this.handleOptionChange(e, "theme") }
                          options={ Object.keys(themes) }
                          defaultValue={ this.state.settings.theme }/>
          </div>
        </div>
        <div className={ css(this.style.option) }>
          <h2 className={ css(this.style.headers) }>Word Count</h2>
          <div>
            <RadioCluster onChange={ (e) => this.handleOptionChange(e, "countType") }
                          options={ ["words", "characters", "none"] }
                          defaultValue={ this.state.settings.countType }/>
          </div>
        </div>
        <div className={ css(this.style.option) }>
          <h2 className={ css(this.style.headers) }>Sizing</h2>
          <div className={ css(this.style.innerContainer) }>
            <h3 className={ css([this.style.h3, this.style.headers]) }>Font Size</h3>
            <input type="number"
                   min="1"
                   max="Infinity"
                   name="fontSize"
                   className={ css(this.style.input) }
                   defaultValue={ this.state.settings.fontSize }
                   onChange={ this.handleNumChange.bind(this) }/><p className={ css(this.style.p) }>px</p>
            <br/>
            <p className={ css(this.style.p) }>Different Fonts may have different sizes regardless of if they have the same px size</p>
          </div>
          <div className={ css(this.style.innerContainer) }>
            <h3 className={ css([this.style.h3, this.style.headers]) }>Tab Size</h3>
            <input type="number"
                   min="1"
                   max="Infinity"
                   name="tabSize"
                   className={ css(this.style.input) }
                   defaultValue={ this.state.settings.tabSize }
                   onChange={ this.handleNumChange.bind(this) }/>
          </div>
          <div className={ css(this.style.innerContainer) }>
            <h3 className={ css([this.style.h3, this.style.headers]) }>Line Height</h3>
            <input type="number"
                   min="1"
                   max="Infinity"
                   name="lineHeight"
                   className={ css(this.style.input) }
                   defaultValue={ this.state.settings.lineHeight }
                   onChange={ this.handleNumChange.bind(this) }/><p className={ css(this.style.p) }>em</p>
          </div>
        </div>
        <div className={ css(this.style.option) }>
          <h2 className={ css(this.style.headers) }>Markdown Options</h2>
          <div className={ css(this.style.toggleContainer) }>
            <p className={ css(this.style.toggleLabel) }>Fade Formatting</p>
            <ToggleButton defaultValue={ this.state.settings.fadeFormatting }
                          onChange={ (e) => this.handleToggleChange(e, "fadeFormatting") }/>
          </div>
          <div className={ css(this.style.toggleContainer) }>
            <p className={ css(this.style.toggleLabel) }>Line Wrap</p>
            <ToggleButton defaultValue={ this.state.settings.wrapLine }
                          onChange={ (e) => this.handleToggleChange(e, "wrapLine") }/>
          </div>
          <div className={ css(this.style.toggleContainer) }>
            <p className={ css(this.style.toggleLabel) }>Focus Active Line</p>
            <ToggleButton defaultValue={ this.state.settings.focusLine }
                          onChange={ (e) => this.handleToggleChange(e, "focusLine") }/>
          </div>
          <div className={ css(this.style.toggleContainer) }>
            <p className={ css(this.style.toggleLabel) }>Enlarge Headings</p>
            <ToggleButton defaultValue={ this.state.settings.EnlargeHeaders }
                          onChange={ (e) => this.handleToggleChange(e, "EnlargeHeaders") }/>
          </div>
          { api.isMobile() && (
            <div className={ css(this.style.toggleContainer) }>
              <p className={ css(this.style.toggleLabel) }>Show Toolbar</p>
              <ToggleButton defaultValue={ this.state.settings.showToolbar }
                onChange={ (e) => this.handleToggleChange(e, "showToolbar") }/>
            </div>
          ) }
        </div>
        <button onClick={ this.handleSave.bind(this) }
                className={ css(this.style.saveButton) }>Save</button>
      </div>
    )
  }
}
