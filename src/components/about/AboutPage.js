import React from 'react';
import Typography from '@material-ui/core/Typography';

class AboutPage extends React.Component {
    render() {
        return (
            <div style={{padding: "10px"}}>
                <Typography variant="headline" align="center" gutterBottom>About this Application</Typography>

                <Typography>This application estimates the road surface area of a given set of bounds.</Typography>
                <Typography>You can change these bounds by scrolling the map and clicking the RELOAD MAP AND DATA button.</Typography>
                <Typography>All values are estimated based on OpenStreetMap data.</Typography>
                <Typography>This interface uses some of the following React modules: Material-UI, React-Leaflet, react-places-autocomplete</Typography>
                <Typography>This project was developed by Michael Franklin for FIT3036 (Computer Science Project), supervised by Dr. Rasika Amarasiri.</Typography>
            </div>
        );
    }
}

export default AboutPage;