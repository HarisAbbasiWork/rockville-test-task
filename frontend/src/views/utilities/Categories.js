import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import axios from 'axios'; // Import Axios

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

// ==============================|| TYPOGRAPHY ||============================== //

const Typography = () => {
  // State for categories
  const [categories, setCategories] = useState([]);

  // Effect to fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:3001/movie/categories',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTg1ZDc1ZWJiZDc3OTcxZDc2NzBiMmEiLCJpYXQiOjE3MDMzMjgwODEsImV4cCI6MTcwMzMzMzQ4MX0.OZNFF6tEyhPhLrbf2huXfHIgGZ_GS6Ys86Y4iEMhprs'
          }
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Call the function to fetch categories
    getCategories();
  }, []);

  return (
    <MainCard title="Movie Categories" secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard title="Categories">
            <Grid container direction="column" spacing={1}>
              {categories.map((category) => (
                <Grid item key={category.id}>
                  <MuiTypography variant="body1" gutterBottom>
                    {category.name}
                  </MuiTypography>
                </Grid>
              ))}
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Typography;