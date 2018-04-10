import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { AppBar, Toolbar, Typography, IconButton, Icon } from 'material-ui';
import HelpIcon from 'material-ui-icons/Help';

const styles = {
  flex: {
    flex: 1
  },
  helpButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

const Header = ({classes}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit" className={classes.flex}>
          Road Surface Estimation
        </Typography>
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup="true"
          // onClick={this.handleMenu}
          color="inherit"
        >
          <HelpIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(Header);