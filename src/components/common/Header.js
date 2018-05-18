import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { AppBar, Toolbar, Typography, IconButton, Icon, Popover } from 'material-ui';
import HelpIcon from 'material-ui-icons/Help';
import AboutPage from '../about/AboutPage';

const styles = (theme) => ({
  flex: {
    flex: 1
  },
  helpButton: {
    marginLeft: -12,
    marginRight: 20
  },
  popover: {
    margin: theme.spacing.unit * 2
  }
});

class Header extends React.Component {

  constructor(props, content) {
    super(props, content);
    this.state = {
      helpAnchor: null
    };
    this.clickHelp = this.clickHelp.bind(this);
    this.closeHelp = this.closeHelp.bind(this);
  }

  clickHelp(e) {
    this.setState(Object.assign({}, this.state, { helpAnchor: e.target }));
  }

  closeHelp() {
    this.setState(Object.assign({}, this.state, { helpAnchor: null }));
  }
  
  render() {
    const { classes } = this.props;
    return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit" className={classes.flex}>
          Road Surface Estimation
        </Typography>
        <HelpIcon onClick={this.clickHelp}/>
        <Popover
          open={Boolean(this.state.helpAnchor)}
          anchorEl={this.state.helpAnchor}
          onClose={this.closeHelp}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
        <AboutPage className={classes.popover} />
        </Popover>
      </Toolbar>
    </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};



export default withStyles(styles)(Header);