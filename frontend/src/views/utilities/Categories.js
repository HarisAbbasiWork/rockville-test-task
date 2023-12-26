import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import axios from 'axios'; // Import Axios
// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { useSelector } from 'react-redux';

// ==============================|| TYPOGRAPHY ||============================== //

const Typography = () => {
  // State for categories
  const [categories, setCategories] = useState([]);
  const accessToken = useSelector((state) => state.user.accessToken);
  console.log("accessToken ",accessToken)
  // Effect to fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:3001/movie/categories',
          headers: {
            'Authorization': `Bearer ${accessToken}`
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
