import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadData, updateBounds } from '../../actions/dataActions';

import { withStyles } from 'material-ui/styles';
import NumberFormat from 'react-number-format';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import CalculationOptions from './CalculationOptions';

const styles = {
  button: {
      display: "flex",
      margin: "15px auto 0 auto"
  }
};

class BoundsForm extends React.Component {

  constructor(props, content) {
    super(props, content);
    this.state = {
      textBounds: props.bounds,
      roadOption: 'truncate'
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.tfBoundsChanged = this.tfBoundsChanged.bind(this);
    this.onRoadOptionChanged = this.onRoadOptionChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bounds === nextProps.bounds) return; 
    this.setState(Object.assign({}, this.state, { textBounds: nextProps.bounds }));
  }

  onFormSubmit(e) {
    e.preventDefault();
    const { left, right, top, bottom } = this.state.textBounds;
    const option = this.state.roadOption;
    this.props.actions.loadData(left, bottom, right, top, option)
  }

  onRoadOptionChanged(e) {
    this.setState(Object.assign({}, this.state, { roadOption: e.target.value }));
  }

  tfBoundsChanged(e) {
    const value = Number(e.target.value) || this.state.bounds[e.target.id];
    let bounds = Object.assign({}, this.state.textBounds, {[e.target.id] : e.target.value});
    this.setState(Object.assign({}, this.state, { textBounds: bounds }));
  }
  
  render() {
    return (
      <div>
        <p>Bounds of the map are:</p>
        <form onSubmit={this.onFormSubmit} noValidate autoComplete="off">
        {["left", "bottom", "right", "top"].map((val, idx) => {
          return (<NumberFormat fullWidth key={idx} decimalScale={5}
            label={val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()} 
            value={this.state.textBounds[val]} 
            id={val}    
            customInput={TextField} 
            onChange={this.tfBoundsChanged} 
          />);
        })}
        <br />
        <CalculationOptions roadOption={this.state.roadOption} onRoadOptionChanged={this.onRoadOptionChanged} />
        <Button type="submit" variant="raised" size="medium" color="secondary" className={this.props.classes.button}>
          Reload Map and Data
        </Button>
        </form>
      </div>
    );
  }
}

BoundsForm.propTypes = {
  classes: PropTypes.object,
  bounds: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state, ownProps) {
  return {
    bounds : state.data.bounds
  };
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators({ loadData, updateBounds }, dispatch)
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BoundsForm));

