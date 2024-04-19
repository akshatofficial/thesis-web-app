import { AddAPhotoOutlined, SendOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  colors,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { handlePredictLabel } from '../../api';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#2F667F',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledPredictButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2F667F',
  color: 'white',

  '&:hover': {
    backgroundColor: 'rgba(47, 102, 127, 0.9)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(47, 102, 127, 0.3)',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const convertToExponential = (val) => {
  let res;
  if (/\d+\.?\d*e[\+\-]\d+/i.test(val)) {
    res = val;
  } else {
    res = Number(val).toExponential();
  }
  return res;
};

function Prediction() {
  const indexToLabelMapping = [
    'Annual Crop',
    'Forest',
    'Herbaceous Vegetation',
    'Highway',
    'Industrial',
    'Pasture',
    'Permanent Crop',
    'Residential',
    'River',
    'SeaLake',
  ];
  const [image, setImage] = useState({ preview: '', raw: '', fileName: '' });
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [predictionModel, setPredictionModel] = useState('resNet50V2');
  const handleChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileName: e.target.files[0].name,
      });
    }
  };
  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      setPredictionData(null);
      setIsPredicting(true);
      const formData = new FormData();
      formData.append('image', image.raw);
      formData.append('selected_model', predictionModel);
      const { data } = await handlePredictLabel(formData);
      setPredictionData(data);
      console.log(data);
    } catch (e) {
    } finally {
      setIsPredicting(false);
    }
  };
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, m: '1rem', display: 'flex', height: '95vh' }}>
      <Box sx={{ flex: 1, textAlign: 'center', margin: 'auto' }}>
        {image.preview && (
          <Paper sx={{ mx: '4rem' }}>
            <img src={image.preview} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '250px' }} />
            <br />
            <Typography>{image.fileName}</Typography>
          </Paper>
        )}
        <br />
        <Stack direction={'row'} spacing={2} justifyContent={'center'}>
          <Button component="label" tabIndex={-1} variant="outlined" startIcon={<AddAPhotoOutlined />}>
            Upload Satellite Image
            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleChange} />
          </Button>

          {image.preview && (
            <Select
              value={predictionModel}
              onChange={(e) => setPredictionModel(e.target.value)}
              input={<OutlinedInput />}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem disabled value="">
                <em>Select model for prediction</em>
              </MenuItem>
              <MenuItem key={'random_forest'} value={'random_forest'}>
                Random Forest
              </MenuItem>
              <MenuItem key={'resNet50'} value={'resNet50'}>
                ResNet50
              </MenuItem>
              <MenuItem key={'resNet50V2'} value={'resNet50V2'}>
                ResNet50 V2
              </MenuItem>
              <MenuItem key={'resNet152V2'} value={'resNet152V2'}>
                ResNet152 V2
              </MenuItem>
              <MenuItem key={'vgg16'} value={'vgg16'}>
                VGG 16
              </MenuItem>
              <MenuItem key={'vgg19'} value={'vgg19'}>
                VGG 19
              </MenuItem>
            </Select>
          )}
          {image.preview && (
            <StyledPredictButton variant="outlined" endIcon={<SendOutlined />} onClick={handlePredict}>
              Predict
            </StyledPredictButton>
          )}
        </Stack>
      </Box>
      <Box sx={{ flex: 1, margin: 'auto' }}>
        {predictionData && Object.keys(predictionData) ? (
          predictionData.prediction_probabilities.length === 0 ? (
            <Paper sx={{ p: '1rem', textAlign: 'center' }}>
              <Typography component={'h6'}>
                The predicted label of the uploaded image is{' '}
                <span style={{ color: '#2F667F', fontWeight: '800' }}>
                  {indexToLabelMapping[predictionData.predicted_class[0]]}
                </span>{' '}
                based on the selected algorithm.
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="probability table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sr. No.</StyledTableCell>
                    <StyledTableCell align="center">Label</StyledTableCell>
                    <StyledTableCell align="center">Probability&nbsp;</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictionData &&
                    predictionData.prediction_probabilities.length &&
                    predictionData.prediction_probabilities[0].length &&
                    predictionData.prediction_probabilities[0].map((row, idx) => (
                      <StyledTableRow
                        key={indexToLabelMapping[idx]}
                        sx={{
                          border: idx === predictionData.predicted_class[0] ? '6px solid green' : 'none',
                          borderRadius: idx === predictionData.predicted_class[0] ? '2rem' : 'none',
                        }}
                      >
                        <StyledTableCell component="th" scope="row">
                          {idx}
                        </StyledTableCell>
                        <StyledTableCell align="center">{indexToLabelMapping[idx]}</StyledTableCell>
                        <StyledTableCell align="center">{convertToExponential(row)}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        ) : isPredicting ? (
          <Paper
            sx={{ width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}
          >
            <CircularProgress size={'80px'} />
          </Paper>
        ) : (
          <Typography component={'h6'}>
            Upload the image and click on predict button to get the prediction of label.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Prediction;
