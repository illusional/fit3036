import React from 'react';
import Typography from 'material-ui/Typography';

class AboutPage extends React.Component {
    render() {
        return (
            <div style={{padding: "10px"}}>
                <Typography>About</Typography>
                <Typography>This application uses React, React-Router and was built based on a tutorial from PuralSight</Typography>
            </div>
        );
    }
}

export default AboutPage;