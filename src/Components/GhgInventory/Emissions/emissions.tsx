import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './emissions.scss';
import {
  Form,
  DatePicker,
  Upload,
  Button,
  Tabs,
  Input,
  Col,
  Row,
  Collapse,
  InputNumber,
  message,
} from 'antd';
import {
  UploadOutlined,
  LockFilled,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { RcFile } from 'antd/lib/upload';

import { EmissionTypes } from '../emission.types';
import { EmissionSectors, formFields } from '../emission.mappings';
import { CompanyRole } from '../../../Definitions';
import { HttpStatusCode } from 'axios';
// import React from 'react';

export const GHGEmissionsComponent = (props: any) => {
  const {
    t,
    useUserContext,
    useConnection,
  } = props;
  const { userInfoState } = useUserContext();
  const data: any = [
    {
      id: 1,
      country: 'NG',
      year: 2023,
      energyEmissions: {
        fuelCombustionActivities: {
          energyIndustries: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          manufacturingIndustriesConstruction: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          transport: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          otherSectors: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          nonSpecified: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        },
        fugitiveEmissionsFromFuels: {
          solidFuels: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          oilNaturalGas: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          otherEmissionsEnergyProduction: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        },
        carbonDioxideTransportStorage: {
          transportOfCo2: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          injectionStorage: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        },
      },
      industrialProcessesProductUse: {
        mineralIndustry: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        chemicalIndustry: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        metalIndustry: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        nonEnergyProductsFuelsSolventUse: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        electronicsIndustry: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        productUsesSubstOzoneDepletingSubs: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        otherProductManufactureUse: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      },
      agricultureForestryOtherLandUse: {
        livestock: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        land: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        aggregateNonCo2SourcesLand: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      },
      waste: {
        solidWasteDisposal: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        biologicalTreatmentSolidWaste: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        incinerationOpenBurningWaste: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        wastewaterTreatmentDischarge: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      },
      other: {
        indirectN2oEmissions: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      },
      totalCo2WithoutLand: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      totalCo2WithLand: { co2: 30, ch4: 15, n2o: 33, co2eq: 41 },
      state: 'SAVED',
      version: 2,
      created_at: 1698644100397,
    },
    {
      id: 2,
      country: 'NG',
      year: 2022,
      energyEmissions: {
        fuelCombustionActivities: {
          energyIndustries: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          manufacturingIndustriesConstruction: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          transport: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          otherSectors: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          nonSpecified: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        },
        fugitiveEmissionsFromFuels: {
          solidFuels: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          oilNaturalGas: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          otherEmissionsEnergyProduction: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        },
        carbonDioxideTransportStorage: {
          transportOfCo2: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          injectionStorage: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
          other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        },
      },
      industrialProcessesProductUse: {
        mineralIndustry: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        chemicalIndustry: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        metalIndustry: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        nonEnergyProductsFuelsSolventUse: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        electronicsIndustry: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        productUsesSubstOzoneDepletingSubs: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        otherProductManufactureUse: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      },
      agricultureForestryOtherLandUse: {
        livestock: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        land: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        aggregateNonCo2SourcesLand: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      },
      waste: {
        solidWasteDisposal: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        biologicalTreatmentSolidWaste: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        incinerationOpenBurningWaste: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        wastewaterTreatmentDischarge: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      },
      other: {
        indirectN2oEmissions: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
        other: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      },
      totalCo2WithoutLand: { co2: 20, ch4: 15, n2o: 33, co2eq: 41 },
      totalCo2WithLand: { co2: 30, ch4: 15, n2o: 33, co2eq: 41 },
      state: 'FINALIZED',
      version: 1,
      created_at: 1698644100397,
    },
  ];
  const { put, get, post } = useConnection();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPendingFinalization, setIsPendingFinalization] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [disabledYears, setDisabledYears] = useState<number[]>([]);
  const [changedValues, setChangedValues] = useState<any>();

  const [totalNationalCo2, setTotalNationalCo2] = useState<number>(0);
  const [totalNationalCh4, setTotalNationalCh4] = useState<number>(0);
  const [totalNationalN2o, setTotalNationalN2o] = useState<number>(0);
  const [totalNationalCo2Eq, setTotalNationalCo2Eq] = useState<number>(0);

  const [energyEmissionsCo2, setEnergyEmissionsCo2] = useState<number>(0);
  const [energyEmissionsCh4, setEnergyEmissionsCh4] = useState<number>(0);
  const [energyEmissionsN2o, setEnergyEmissionsN2o] = useState<number>(0);
  const [energyEmissionsCo2Eq, setEnergyEmissionsCo2Eq] = useState<number>(0);

  const [fuelCombustionActivitiesCo2, setFuelCombustionActivitiesCo2] = useState<number>(0);
  const [fuelCombustionActivitiesCh4, setFuelCombustionActivitiesCh4] = useState<number>(0);
  const [fuelCombustionActivitiesN2o, setFuelCombustionActivitiesN2o] = useState<number>(0);
  const [fuelCombustionActivitiesCo2Eq, setFuelCombustionActivitiesCo2Eq] = useState<number>(0);

  const [fugitiveEmissionsFromFuelsCo2, setFugitiveEmissionsFromFuelsCo2] = useState<number>(0);
  const [fugitiveEmissionsFromFuelsCh4, setFugitiveEmissionsFromFuelsCh4] = useState<number>(0);
  const [fugitiveEmissionsFromFuelsN2o, setFugitiveEmissionsFromFuelsN2o] = useState<number>(0);
  const [fugitiveEmissionsFromFuelsCo2Eq, setFugitiveEmissionsFromFuelsCo2Eq] = useState<number>(0);

  const [carbonDioxideTransportStorageCo2, setCarbonDioxideTransportStorageCo2] =
    useState<number>(0);
  const [carbonDioxideTransportStorageCh4, setCarbonDioxideTransportStorageCh4] =
    useState<number>(0);
  const [carbonDioxideTransportStorageN2o, setCarbonDioxideTransportStorageN2o] =
    useState<number>(0);
  const [carbonDioxideTransportStorageCo2Eq, setCarbonDioxideTransportStorageCo2Eq] =
    useState<number>(0);

  const [industrialProcessesProductUseCo2, setIndustrialProcessesProductUseCo2] =
    useState<number>(0);
  const [industrialProcessesProductUseCh4, setIndustrialProcessesProductUseCh4] =
    useState<number>(0);
  const [industrialProcessesProductUseN2o, setIndustrialProcessesProductUseN2o] =
    useState<number>(0);
  const [industrialProcessesProductUseCo2Eq, setIndustrialProcessesProductUseCo2Eq] =
    useState<number>(0);

  const [agricultureForestryOtherLandUseCo2, setAgricultureForestryOtherLandUseCo2] =
    useState<number>(0);
  const [agricultureForestryOtherLandUseCh4, setAgricultureForestryOtherLandUseCh4] =
    useState<number>(0);
  const [agricultureForestryOtherLandUseN2o, setAgricultureForestryOtherLandUseN2o] =
    useState<number>(0);
  const [agricultureForestryOtherLandUseCo2Eq, setAgricultureForestryOtherLandUseCo2Eq] =
    useState<number>(0);

  const [wasteCo2, setWasteCo2] = useState<number>(0);
  const [wasteCh4, setWasteCh4] = useState<number>(0);
  const [wasteN2o, setWasteN2o] = useState<number>(0);
  const [wasteCo2Eq, setWasteCo2Eq] = useState<number>(0);

  const [otherCo2, setOtherCo2] = useState<number>(0);
  const [otherCh4, setOtherCh4] = useState<number>(0);
  const [otherN2o, setOtherN2o] = useState<number>(0);
  const [otherCo2Eq, setOtherCo2Eq] = useState<number>(0);

  const [isSavedFormDataSet, setIsSavedFormDataSet] = useState<boolean>(false);

  const { Panel } = Collapse;
  const [form] = Form.useForm();

  const createSetFieldObject = (obj: any, objName: string) => {
    const result: any = {};

    for (const key in obj) {
      const energyEmissionsSub = obj[key];
      for (const childKey in energyEmissionsSub) {
        if (typeof energyEmissionsSub[childKey] === 'object') {
          for (const category in energyEmissionsSub) {
            const subcategory = energyEmissionsSub[category];

            for (const gas in subcategory) {
              result[`${key}_${category}_${gas}`] = subcategory[gas];
            }
          }
        } else {
          for (const gas in energyEmissionsSub) {
            result[`${objName}_${key}_${gas}`] = energyEmissionsSub[gas];
          }
        }
      }
    }
    return result;
  };

  const validateExcelDataFormat = (sheetHeadings: any) => {
    const columnHeadings = ['Sector', 'CO2', 'CH4', 'N2O', 'CO2-eq'];
    return sheetHeadings.every((element: any) => columnHeadings.includes(element));
  };

  const populateFormWithUploadedFile = (excelData: any, keyPrefix: string) => {
    const result: any = {};
    const emissions: any = {};
    for (const key in EmissionTypes) {
      emissions[key] = excelData[EmissionTypes[key]];
    }
    return (result[keyPrefix] = emissions);
  };

  const handleFileUploadData = (excelData: any) => {
    const result: any = {};
    excelData.forEach((excelDataObj: any) => {
      if (Object.keys(EmissionSectors).includes(excelDataObj.Sector)) {
        result[EmissionSectors[excelDataObj.Sector]] = populateFormWithUploadedFile(
          excelDataObj,
          EmissionSectors[excelDataObj.Sector]
        );
      }
    });
    const upData = {
      energyEmissions: {
        fuelCombustionActivities: {
          energyIndustries: result.energyIndustries,
          manufacturingIndustriesConstruction: result.manufacturingIndustriesConstruction,
          transport: result.transport,
          otherSectors: result.otherSectors,
          nonSpecified: result.nonSpecified,
        },
        fugitiveEmissionsFromFuels: {
          solidFuels: result.solidFuels,
          oilNaturalGas: result.oilNaturalGas,
          otherEmissionsEnergyProduction: result.otherEmissionsEnergyProduction,
        },
        carbonDioxideTransportStorage: {
          transportOfCo2: result.transportOfCo2,
          injectionStorage: result.injectionStorage,
          other: result.otherCarbonDioxideTransportStorage,
        },
      },
      industrialProcessesProductUse: {
        mineralIndustry: result.mineralIndustry,
        chemicalIndustry: result.chemicalIndustry,
        metalIndustry: result.metalIndustry,
        nonEnergyProductsFuelsSolventUse: result.nonEnergyProductsFuelsSolventUse,
        electronicsIndustry: result.electronicsIndustry,
        productUsesSubstOzoneDepletingSubs: result.productUsesSubstOzoneDepletingSubs,
        otherProductManufactureUse: result.otherProductManufactureUse,
        other: result.otherIndustrialProcessesProductUse,
      },
      agricultureForestryOtherLandUse: {
        livestock: result.livestock,
        land: result.land,
        aggregateNonCo2SourcesLand: result.aggregateNonCo2SourcesLand,
        other: result.otherAgricultureForestryOtherLandUse,
      },
      waste: {
        solidWasteDisposal: result.solidWasteDisposal,
        biologicalTreatmentSolidWaste: result.biologicalTreatmentSolidWaste,
        incinerationOpenBurningWaste: result.incinerationOpenBurningWaste,
        wastewaterTreatmentDischarge: result.wastewaterTreatmentDischarge,
        other: result.otherWaste,
      },
      other: {
        indirectN2oEmissions: result.indirectN2oEmissions,
        other: result.other,
      },
      totalCo2WithoutLand: result.totalCo2WithoutLand,
      totalCo2WithLand: result.totalCo2WithLand,
    };
    // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
    setFormValues(upData);
  };

  useEffect(() => {
    const hasSaveState = data.some((item: any) => item.state === 'SAVED');
    const years = data.map((item: any) => !(item.state === 'SAVED') && item.year);
    console.log(uploadedFileName);
    setIsPendingFinalization(hasSaveState);
    // Update 'disabledYears' only if 'years' array has changed
    setDisabledYears((prevYears) => {
      if (JSON.stringify(prevYears) !== JSON.stringify(years)) {
        return years;
      }
      return prevYears;
    });
  }, [data, uploadedFileName]);

  const handleYearChange = (date: any, dateString: string) => {
    setSelectedYear(dateString);
  };

  function calculateSumEmissionView(obj: any, gasType: string) {
    let sum = 0;
    for (const key in obj) {
      if (key === gasType) {
        sum += obj[key];
      } else if (
        typeof obj[key] === 'object' &&
        key !== 'totalCo2WithLand' &&
        key !== 'totalCo2WithoutLand'
      ) {
        sum += calculateSumEmissionView(obj[key], gasType);
      }
    }
    return sum;
  }

  const onValuesChange = (changedValues2: any, allValues: any) => {
    // Track the changed values
    setChangedValues((prevChangedValues: any) => ({
      ...prevChangedValues,
      ...changedValues2,
    }));
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const createSaveRequestPayload = async (fields: any) => {
    let requestBody: any = {};
    const savedEmission = {
      year: fields?.year.year(),
      energyEmissions: {
        fuelCombustionActivities: {
          energyIndustries: {
            co2: fields?.fuelCombustionActivities_energyIndustries_co2,
            ch4: fields?.fuelCombustionActivities_energyIndustries_ch4,
            co2eq: fields?.fuelCombustionActivities_energyIndustries_co2eq,
            n2o: fields?.fuelCombustionActivities_energyIndustries_n2o,
          },
          manufacturingIndustriesConstruction: {
            co2: fields?.fuelCombustionActivities_manufacturingIndustriesConstruction_co2,
            ch4: fields?.fuelCombustionActivities_manufacturingIndustriesConstruction_ch4,
            n2o: fields?.fuelCombustionActivities_manufacturingIndustriesConstruction_n2o,
            co2eq: fields?.fuelCombustionActivities_manufacturingIndustriesConstruction_co2eq,
          },
          transport: {
            co2: fields?.fuelCombustionActivities_transport_co2,
            ch4: fields?.fuelCombustionActivities_transport_ch4,
            n2o: fields?.fuelCombustionActivities_transport_n2o,
            co2eq: fields?.fuelCombustionActivities_transport_co2eq,
          },
          otherSectors: {
            co2: fields?.fuelCombustionActivities_otherSectors_co2,
            ch4: fields?.fuelCombustionActivities_otherSectors_ch4,
            n2o: fields?.fuelCombustionActivities_otherSectors_n2o,
            co2eq: fields?.fuelCombustionActivities_otherSectors_co2eq,
          },
          nonSpecified: {
            co2: fields?.fuelCombustionActivities_nonSpecified_co2,
            ch4: fields?.fuelCombustionActivities_nonSpecified_ch4,
            n2o: fields?.fuelCombustionActivities_nonSpecified_n2o,
            co2eq: fields?.fuelCombustionActivities_nonSpecified_co2eq,
          },
        },
        fugitiveEmissionsFromFuels: {
          solidFuels: {
            co2: fields?.fugitiveEmissionsFromFuels_solidFuels_co2,
            ch4: fields?.fugitiveEmissionsFromFuels_solidFuels_ch4,
            n2o: fields?.fugitiveEmissionsFromFuels_solidFuels_n2o,
            co2eq: fields?.fugitiveEmissionsFromFuels_solidFuels_co2eq,
          },
          oilNaturalGas: {
            co2: fields?.fugitiveEmissionsFromFuels_oilNaturalGas_co2,
            ch4: fields?.fugitiveEmissionsFromFuels_oilNaturalGas_ch4,
            n2o: fields?.fugitiveEmissionsFromFuels_oilNaturalGas_n2o,
            co2eq: fields?.fugitiveEmissionsFromFuels_oilNaturalGas_co2eq,
          },
          otherEmissionsEnergyProduction: {
            co2: fields?.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_co2,
            ch4: fields?.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_ch4,
            n2o: fields?.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_n2o,
            co2eq: fields?.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_co2eq,
          },
        },
        carbonDioxideTransportStorage: {
          transportOfCo2: {
            co2: fields?.carbonDioxideTransportStorage_transportOfCo2_co2,
            ch4: fields?.carbonDioxideTransportStorage_transportOfCo2_ch4,
            n2o: fields?.carbonDioxideTransportStorage_transportOfCo2_n2o,
            co2eq: fields?.carbonDioxideTransportStorage_transportOfCo2_co2eq,
          },
          injectionStorage: {
            co2: fields?.carbonDioxideTransportStorage_injectionStorage_co2,
            ch4: fields?.carbonDioxideTransportStorage_injectionStorage_ch4,
            n2o: fields?.carbonDioxideTransportStorage_injectionStorage_n2o,
            co2eq: fields?.carbonDioxideTransportStorage_injectionStorage_co2eq,
          },
          other: {
            co2: fields?.carbonDioxideTransportStorage_other_co2,
            ch4: fields?.carbonDioxideTransportStorage_other_ch4,
            n2o: fields?.carbonDioxideTransportStorage_other_n2o,
            co2eq: fields?.carbonDioxideTransportStorage_other_co2eq,
          },
        },
      },
      industrialProcessesProductUse: {
        mineralIndustry: {
          co2: fields?.industrialProcessesProductUse_mineralIndustry_co2,
          ch4: fields?.industrialProcessesProductUse_mineralIndustry_ch4,
          n2o: fields?.industrialProcessesProductUse_mineralIndustry_n2o,
          co2eq: fields?.industrialProcessesProductUse_mineralIndustry_co2eq,
        },
        chemicalIndustry: {
          co2: fields?.industrialProcessesProductUse_chemicalIndustry_co2,
          ch4: fields?.industrialProcessesProductUse_chemicalIndustry_ch4,
          n2o: fields?.industrialProcessesProductUse_chemicalIndustry_n2o,
          co2eq: fields?.industrialProcessesProductUse_chemicalIndustry_co2eq,
        },
        metalIndustry: {
          co2: fields?.industrialProcessesProductUse_metalIndustry_co2,
          ch4: fields?.industrialProcessesProductUse_metalIndustry_ch4,
          n2o: fields?.industrialProcessesProductUse_metalIndustry_n2o,
          co2eq: fields?.industrialProcessesProductUse_metalIndustry_co2eq,
        },
        nonEnergyProductsFuelsSolventUse: {
          co2: fields?.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_co2,
          ch4: fields?.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_ch4,
          n2o: fields?.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_n2o,
          co2eq: fields?.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_co2eq,
        },
        electronicsIndustry: {
          co2: fields?.industrialProcessesProductUse_electronicsIndustry_co2,
          ch4: fields?.industrialProcessesProductUse_electronicsIndustry_ch4,
          n2o: fields?.industrialProcessesProductUse_electronicsIndustry_n2o,
          co2eq: fields?.industrialProcessesProductUse_electronicsIndustry_co2eq,
        },
        productUsesSubstOzoneDepletingSubs: {
          co2: fields?.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_co2,
          ch4: fields?.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_ch4,
          n2o: fields?.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_n2o,
          co2eq: fields?.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_co2eq,
        },
        otherProductManufactureUse: {
          co2: fields?.industrialProcessesProductUse_otherProductManufactureUse_co2,
          ch4: fields?.industrialProcessesProductUse_otherProductManufactureUse_ch4,
          n2o: fields?.industrialProcessesProductUse_otherProductManufactureUse_n2o,
          co2eq: fields?.industrialProcessesProductUse_otherProductManufactureUse_co2eq,
        },
        other: {
          co2: fields?.industrialProcessesProductUse_other_co2,
          ch4: fields?.industrialProcessesProductUse_other_ch4,
          n2o: fields?.industrialProcessesProductUse_other_n2o,
          co2eq: fields?.industrialProcessesProductUse_other_co2eq,
        },
      },
      agricultureForestryOtherLandUse: {
        livestock: {
          co2: fields?.agricultureForestryOtherLandUse_livestock_co2,
          ch4: fields?.agricultureForestryOtherLandUse_livestock_ch4,
          n2o: fields?.agricultureForestryOtherLandUse_livestock_n2o,
          co2eq: fields?.agricultureForestryOtherLandUse_livestock_co2eq,
        },
        land: {
          co2: fields?.agricultureForestryOtherLandUse_land_co2,
          ch4: fields?.agricultureForestryOtherLandUse_land_ch4,
          n2o: fields?.agricultureForestryOtherLandUse_land_n2o,
          co2eq: fields?.agricultureForestryOtherLandUse_land_co2eq,
        },
        aggregateNonCo2SourcesLand: {
          co2: fields?.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_co2,
          ch4: fields?.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_ch4,
          n2o: fields?.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_n2o,
          co2eq: fields?.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_co2eq,
        },
        other: {
          co2: fields?.agricultureForestryOtherLandUse_other_co2,
          ch4: fields?.agricultureForestryOtherLandUse_other_ch4,
          n2o: fields?.agricultureForestryOtherLandUse_other_n2o,
          co2eq: fields?.agricultureForestryOtherLandUse_other_co2eq,
        },
      },
      waste: {
        solidWasteDisposal: {
          co2: fields?.waste_solidWasteDisposal_co2,
          ch4: fields?.waste_solidWasteDisposal_ch4,
          n2o: fields?.waste_solidWasteDisposal_n2o,
          co2eq: fields?.waste_solidWasteDisposal_co2eq,
        },
        biologicalTreatmentSolidWaste: {
          co2: fields?.waste_biologicalTreatmentSolidWaste_co2,
          ch4: fields?.waste_biologicalTreatmentSolidWaste_ch4,
          n2o: fields?.waste_biologicalTreatmentSolidWaste_n2o,
          co2eq: fields?.waste_biologicalTreatmentSolidWaste_co2eq,
        },
        incinerationOpenBurningWaste: {
          co2: fields?.waste_incinerationOpenBurningWaste_co2,
          ch4: fields?.waste_incinerationOpenBurningWaste_ch4,
          n2o: fields?.waste_incinerationOpenBurningWaste_n2o,
          co2eq: fields?.waste_incinerationOpenBurningWaste_co2eq,
        },
        wastewaterTreatmentDischarge: {
          co2: fields?.waste_wastewaterTreatmentDischarge_co2,
          ch4: fields?.waste_wastewaterTreatmentDischarge_ch4,
          n2o: fields?.waste_wastewaterTreatmentDischarge_n2o,
          co2eq: fields?.waste_wastewaterTreatmentDischarge_co2eq,
        },
        other: {
          co2: fields?.waste_other_co2,
          ch4: fields?.waste_other_ch4,
          n2o: fields?.waste_other_n2o,
          co2eq: fields?.waste_other_co2eq,
        },
      },
      other: {
        indirectN2oEmissions: {
          co2: fields?.other_indirectN2oEmissions_co2,
          ch4: fields?.other_indirectN2oEmissions_ch4,
          n2o: fields?.other_indirectN2oEmissions_n2o,
          co2eq: fields?.other_indirectN2oEmissions_co2eq,
        },
        other: {
          co2: fields?.other_other_co2,
          ch4: fields?.other_other_ch4,
          n2o: fields?.other_other_n2o,
          co2eq: fields?.other_other_co2eq,
        },
      },
      totalCo2WithoutLand: {
        co2: fields?.totalCo2WithoutLand_co2,
        ch4: fields?.totalCo2WithoutLand_ch4,
        n2o: fields?.totalCo2WithoutLand_n2o,
        co2eq: fields?.totalCo2WithoutLand_co2eq,
      },
      totalCo2WithLand: {
        co2: fields?.totalCo2WithLand_co2,
        ch4: fields?.totalCo2WithLand_ch4,
        n2o: fields?.totalCo2WithLand_n2o,
        co2eq: fields?.totalCo2WithLand_co2eq,
      },
      state: 'SAVED',
    };
    requestBody = savedEmission;
    if (fields?.emissionsDocument) {
      const emissionImportBase64 = await getBase64(
        fields?.emissionsDocument[0]?.originFileObj as RcFile
      );
      if (emissionImportBase64?.length > 0) {
        requestBody.emissionDocument = emissionImportBase64;
      }
    }
    return requestBody;
  };

  const onSubmitForm = async (values: any) => {
    const fields = form.getFieldsValue(true);
    const payload = await createSaveRequestPayload(fields);
    setLoading(true);
    try {
      const response: any = await post('national/emissions', payload);
      console.log('Emission creation -> ', response);
      if (response?.statusText === 'SUCCESS') {
        message.open({
          type: 'success',
          content: response?.status == HttpStatusCode.Created ? t('ghgInventory:emissionCreationSuccess') : t('ghgInventory:emissionUpdateSuccess'),
          duration: 4,
          style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
        });
      }
    } catch (error: any) {
      console.log('Error in emission creation - ', error);
      message.open({
        type: 'error',
        content: error?.message,
        duration: 4,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
    } finally {
      setLoading(false);
    }
  };

  const setFormValues = (emissionObject: any) => {
    if (emissionObject.year) {
      form.setFieldsValue({ year: moment(emissionObject.year, 'YYYY') });
    }
    form.setFieldsValue(createSetFieldObject(emissionObject.energyEmissions, 'energyEmissions'));
    form.setFieldsValue(
      createSetFieldObject(
        emissionObject.industrialProcessesProductUse,
        'industrialProcessesProductUse'
      )
    );
    form.setFieldsValue(
      createSetFieldObject(
        emissionObject.agricultureForestryOtherLandUse,
        'agricultureForestryOtherLandUse'
      )
    );
    form.setFieldsValue(createSetFieldObject(emissionObject.waste, 'waste'));
    form.setFieldsValue(createSetFieldObject(emissionObject.other, 'other'));
    form.setFieldsValue({
      totalCo2WithoutLand_co2: emissionObject.totalCo2WithoutLand.co2,
      totalCo2WithoutLand_ch4: emissionObject.totalCo2WithoutLand.ch4,
      totalCo2WithoutLand_n2o: emissionObject.totalCo2WithoutLand.n2o,
      totalCo2WithoutLand_co2eq: emissionObject.totalCo2WithoutLand.co2eq,
    });
    form.setFieldsValue({
      totalCo2WithLand_co2: emissionObject.totalCo2WithLand.co2,
      totalCo2WithLand_ch4: emissionObject.totalCo2WithLand.ch4,
      totalCo2WithLand_n2o: emissionObject.totalCo2WithLand.n2o,
      totalCo2WithLand_co2eq: emissionObject.totalCo2WithLand.co2eq,
    });

    setFuelCombustionActivitiesCo2(
      calculateSumEmissionView(emissionObject?.energyEmissions.fuelCombustionActivities, 'co2')
    );
    setFuelCombustionActivitiesCh4(
      calculateSumEmissionView(emissionObject?.energyEmissions.fuelCombustionActivities, 'ch4')
    );
    setFuelCombustionActivitiesN2o(
      calculateSumEmissionView(emissionObject?.energyEmissions.fuelCombustionActivities, 'n2o')
    );
    setFuelCombustionActivitiesCo2Eq(
      calculateSumEmissionView(emissionObject?.energyEmissions.fuelCombustionActivities, 'co2eq')
    );

    setFugitiveEmissionsFromFuelsCo2(
      calculateSumEmissionView(emissionObject?.energyEmissions.fugitiveEmissionsFromFuels, 'co2')
    );
    setFugitiveEmissionsFromFuelsCh4(
      calculateSumEmissionView(emissionObject?.energyEmissions.fugitiveEmissionsFromFuels, 'ch4')
    );
    setFugitiveEmissionsFromFuelsN2o(
      calculateSumEmissionView(emissionObject?.energyEmissions.fugitiveEmissionsFromFuels, 'n2o')
    );
    setFugitiveEmissionsFromFuelsCo2Eq(
      calculateSumEmissionView(emissionObject?.energyEmissions.fugitiveEmissionsFromFuels, 'co2eq')
    );

    setCarbonDioxideTransportStorageCo2(
      calculateSumEmissionView(emissionObject?.energyEmissions.carbonDioxideTransportStorage, 'co2')
    );
    setCarbonDioxideTransportStorageCh4(
      calculateSumEmissionView(emissionObject?.energyEmissions.carbonDioxideTransportStorage, 'ch4')
    );
    setCarbonDioxideTransportStorageN2o(
      calculateSumEmissionView(emissionObject?.energyEmissions.carbonDioxideTransportStorage, 'n2o')
    );
    setCarbonDioxideTransportStorageCo2Eq(
      calculateSumEmissionView(
        emissionObject?.energyEmissions.carbonDioxideTransportStorage,
        'co2eq'
      )
    );

    setIndustrialProcessesProductUseCo2(
      calculateSumEmissionView(emissionObject?.industrialProcessesProductUse, 'co2')
    );
    setIndustrialProcessesProductUseCh4(
      calculateSumEmissionView(emissionObject?.industrialProcessesProductUse, 'ch4')
    );
    setIndustrialProcessesProductUseN2o(
      calculateSumEmissionView(emissionObject?.industrialProcessesProductUse, 'n2o')
    );
    setIndustrialProcessesProductUseCo2Eq(
      calculateSumEmissionView(emissionObject?.industrialProcessesProductUse, 'co2eq')
    );

    setAgricultureForestryOtherLandUseCo2(
      calculateSumEmissionView(emissionObject?.agricultureForestryOtherLandUse, 'co2')
    );
    setAgricultureForestryOtherLandUseCh4(
      calculateSumEmissionView(emissionObject?.agricultureForestryOtherLandUse, 'ch4')
    );
    setAgricultureForestryOtherLandUseN2o(
      calculateSumEmissionView(emissionObject?.agricultureForestryOtherLandUse, 'n2o')
    );
    setAgricultureForestryOtherLandUseCo2Eq(
      calculateSumEmissionView(emissionObject?.agricultureForestryOtherLandUse, 'co2eq')
    );

    setWasteCo2(
      calculateSumEmissionView(emissionObject?.waste, 'co2')
    );
    setWasteCh4(
      calculateSumEmissionView(emissionObject?.waste, 'ch4')
    );
    setWasteN2o(
      calculateSumEmissionView(emissionObject?.waste, 'n2o')
    );
    setWasteCo2Eq(
      calculateSumEmissionView(emissionObject?.waste, 'co2eq')
    );

    setOtherCo2(
      calculateSumEmissionView(emissionObject?.other, 'co2')
    );
    setOtherCh4(
      calculateSumEmissionView(emissionObject?.other, 'ch4')
    );
    setOtherN2o(
      calculateSumEmissionView(emissionObject?.other, 'n2o')
    );
    setOtherCo2Eq(
      calculateSumEmissionView(emissionObject?.other, 'co2eq')
    );

    setIsSavedFormDataSet(true);
  };

  useEffect(() => {
    if (isPendingFinalization) {
      if (!isSavedFormDataSet) {
        const savedData = data.filter((item: any) => item.state === 'SAVED');
        setFormValues(savedData[0]);
      }
    }
  }, [data]);

  const checkFile = (file: File) => {
    const isXLSX =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';
    if (!isXLSX) {
      console.log('You can only upload XLSX file!');
    }
    return isXLSX;
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const isYearDisabled = (current: any) => {
    return disabledYears.includes(current.year());
  };

  useEffect(() => {
    setEnergyEmissionsCo2(
      fuelCombustionActivitiesCo2 + fugitiveEmissionsFromFuelsCo2 + carbonDioxideTransportStorageCo2
    );
  }, [
    fuelCombustionActivitiesCo2,
    fugitiveEmissionsFromFuelsCo2,
    carbonDioxideTransportStorageCo2,
  ]);

  useEffect(() => {
    setTotalNationalCo2(
      energyEmissionsCo2 +
        industrialProcessesProductUseCo2 +
        agricultureForestryOtherLandUseCo2 +
        wasteCo2 +
        otherCo2
    );
  }, [
    energyEmissionsCo2 +
      industrialProcessesProductUseCo2 +
      agricultureForestryOtherLandUseCo2 +
      wasteCo2 +
      otherCo2,
  ]);

  useEffect(() => {
    setEnergyEmissionsCh4(
      fuelCombustionActivitiesCh4 + fugitiveEmissionsFromFuelsCh4 + carbonDioxideTransportStorageCh4
    );
  }, [
    fuelCombustionActivitiesCh4,
    fugitiveEmissionsFromFuelsCh4,
    carbonDioxideTransportStorageCh4,
  ]);

  useEffect(() => {
    setTotalNationalCh4(
      energyEmissionsCh4 +
        industrialProcessesProductUseCh4 +
        agricultureForestryOtherLandUseCh4 +
        wasteCh4 +
        otherCh4
    );
  }, [
    energyEmissionsCh4 +
      industrialProcessesProductUseCh4 +
      agricultureForestryOtherLandUseCh4 +
      wasteCh4 +
      otherCh4,
  ]);

  useEffect(() => {
    setEnergyEmissionsN2o(
      fuelCombustionActivitiesN2o + fugitiveEmissionsFromFuelsN2o + carbonDioxideTransportStorageN2o
    );
  }, [
    fuelCombustionActivitiesN2o,
    fugitiveEmissionsFromFuelsN2o,
    carbonDioxideTransportStorageN2o,
  ]);

  useEffect(() => {
    setTotalNationalN2o(
      energyEmissionsN2o +
        industrialProcessesProductUseN2o +
        agricultureForestryOtherLandUseN2o +
        wasteN2o +
        otherN2o
    );
  }, [
    energyEmissionsN2o +
      industrialProcessesProductUseN2o +
      agricultureForestryOtherLandUseN2o +
      wasteN2o +
      otherN2o,
  ]);

  useEffect(() => {
    setEnergyEmissionsCo2Eq(
      fuelCombustionActivitiesCo2Eq +
        fugitiveEmissionsFromFuelsCo2Eq +
        carbonDioxideTransportStorageCo2Eq
    );
  }, [
    fuelCombustionActivitiesCo2Eq,
    fugitiveEmissionsFromFuelsCo2Eq,
    carbonDioxideTransportStorageCo2Eq,
  ]);

  useEffect(() => {
    setTotalNationalCo2Eq(
      energyEmissionsCo2Eq +
        industrialProcessesProductUseCo2Eq +
        agricultureForestryOtherLandUseCo2Eq +
        wasteCo2Eq +
        otherCo2Eq
    );
  }, [
    energyEmissionsCo2Eq +
      industrialProcessesProductUseCo2Eq +
      agricultureForestryOtherLandUseCo2Eq +
      wasteCo2Eq +
      otherCo2Eq,
  ]);

  const calculateSumCo2 = (event: any, panelHeading: any) => {
    const formValues = form.getFieldsValue();

    if (panelHeading === 'fuelCombustionActivities') {
      const sum =
        (formValues.fuelCombustionActivities_energyIndustries_co2 || 0) +
        (formValues.fuelCombustionActivities_manufacturingIndustriesConstruction_co2 || 0) +
        (formValues.fuelCombustionActivities_transport_co2 || 0) +
        (formValues.fuelCombustionActivities_otherSectors_co2 || 0) +
        (formValues.fuelCombustionActivities_nonSpecified_co2 || 0);
      console.log('sum triggered', sum);
      setFuelCombustionActivitiesCo2(sum);
    }
    if (panelHeading === 'fugitiveEmissionsFromFuels') {
      const sum =
        (formValues.fugitiveEmissionsFromFuels_solidFuels_co2 || 0) +
        (formValues.fugitiveEmissionsFromFuels_oilNaturalGas_co2 || 0) +
        (formValues.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_co2 || 0);
      setFugitiveEmissionsFromFuelsCo2(sum);
    }
    if (panelHeading === 'carbonDioxideTransportStorage') {
      const sum =
        (formValues.carbonDioxideTransportStorage_transportOfCo2_co2 || 0) +
        (formValues.carbonDioxideTransportStorage_injectionStorage_co2 || 0) +
        (formValues.carbonDioxideTransportStorage_other_co2 || 0);
      setCarbonDioxideTransportStorageCo2(sum);
    }
    if (panelHeading === 'industrialProcessesProductUse') {
      const sum =
        (formValues.industrialProcessesProductUse_mineralIndustry_co2 || 0) +
        (formValues.industrialProcessesProductUse_chemicalIndustry_co2 || 0) +
        (formValues.industrialProcessesProductUse_metalIndustry_co2 || 0) +
        (formValues.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_co2 || 0) +
        (formValues.industrialProcessesProductUse_electronicsIndustry_co2 || 0) +
        (formValues.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_co2 || 0) +
        (formValues.industrialProcessesProductUse_otherProductManufactureUse_co2 || 0) +
        (formValues.industrialProcessesProductUse_other_co2 || 0);
      setIndustrialProcessesProductUseCo2(sum);
    }
    if (panelHeading === 'agricultureForestryOtherLandUse') {
      const sum =
        (formValues.agricultureForestryOtherLandUse_livestock_co2 || 0) +
        (formValues.agricultureForestryOtherLandUse_land_co2 || 0) +
        (formValues.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_co2 || 0) +
        (formValues.agricultureForestryOtherLandUse_other_co2 || 0);
      setAgricultureForestryOtherLandUseCo2(sum);
    }
    if (panelHeading === 'waste') {
      const sum =
        (formValues.waste_solidWasteDisposal_co2 || 0) +
        (formValues.waste_biologicalTreatmentSolidWaste_co2 || 0) +
        (formValues.waste_incinerationOpenBurningWaste_co2 || 0) +
        (formValues.waste_wastewaterTreatmentDischarge_co2 || 0) +
        (formValues.waste_other_co2 || 0);
      setWasteCo2(sum);
    }
    if (panelHeading === 'other') {
      const sum =
        (formValues.other_indirectN2oEmissions_co2 || 0) + (formValues.other_other_co2 || 0);
      setOtherCo2(sum);
    }
    return 0;
  };

  const calculateSumCh4 = (event: any, panelHeading: any) => {
    const formValues = form.getFieldsValue();

    if (panelHeading === 'fuelCombustionActivities') {
      const sum =
        (formValues.fuelCombustionActivities_energyIndustries_ch4 || 0) +
        (formValues.fuelCombustionActivities_manufacturingIndustriesConstruction_ch4 || 0) +
        (formValues.fuelCombustionActivities_transport_ch4 || 0) +
        (formValues.fuelCombustionActivities_otherSectors_ch4 || 0) +
        (formValues.fuelCombustionActivities_nonSpecified_ch4 || 0);
      setFuelCombustionActivitiesCh4(sum);
    }
    if (panelHeading === 'fugitiveEmissionsFromFuels') {
      const sum =
        (formValues.fugitiveEmissionsFromFuels_solidFuels_ch4 || 0) +
        (formValues.fugitiveEmissionsFromFuels_oilNaturalGas_ch4 || 0) +
        (formValues.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_ch4 || 0);
      setFugitiveEmissionsFromFuelsCh4(sum);
    }
    if (panelHeading === 'carbonDioxideTransportStorage') {
      const sum =
        (formValues.carbonDioxideTransportStorage_transportOfCo2_ch4 || 0) +
        (formValues.carbonDioxideTransportStorage_injectionStorage_ch4 || 0) +
        (formValues.carbonDioxideTransportStorage_other_ch4 || 0);
      setCarbonDioxideTransportStorageCh4(sum);
    }
    if (panelHeading === 'industrialProcessesProductUse') {
      const sum =
        (formValues.industrialProcessesProductUse_mineralIndustry_ch4 || 0) +
        (formValues.industrialProcessesProductUse_chemicalIndustry_ch4 || 0) +
        (formValues.industrialProcessesProductUse_metalIndustry_ch4 || 0) +
        (formValues.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_ch4 || 0) +
        (formValues.industrialProcessesProductUse_electronicsIndustry_ch4 || 0) +
        (formValues.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_ch4 || 0) +
        (formValues.industrialProcessesProductUse_otherProductManufactureUse_ch4 || 0) +
        (formValues.industrialProcessesProductUse_other_ch4 || 0);
      setIndustrialProcessesProductUseCh4(sum);
    }
    if (panelHeading === 'agricultureForestryOtherLandUse') {
      const sum =
        (formValues.agricultureForestryOtherLandUse_livestock_ch4 || 0) +
        (formValues.agricultureForestryOtherLandUse_land_ch4 || 0) +
        (formValues.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_ch4 || 0) +
        (formValues.agricultureForestryOtherLandUse_other_ch4 || 0);
      setAgricultureForestryOtherLandUseCh4(sum);
    }
    if (panelHeading === 'waste') {
      const sum =
        (formValues.waste_solidWasteDisposal_ch4 || 0) +
        (formValues.waste_biologicalTreatmentSolidWaste_ch4 || 0) +
        (formValues.waste_incinerationOpenBurningWaste_ch4 || 0) +
        (formValues.waste_wastewaterTreatmentDischarge_ch4 || 0) +
        (formValues.waste_other_ch4 || 0);
      setWasteCh4(sum);
    }
    if (panelHeading === 'other') {
      const sum =
        (formValues.other_indirectN2oEmissions_ch4 || 0) + (formValues.other_other_ch4 || 0);
      setOtherCh4(sum);
    }
    return 0;
  };

  const calculateSumN2o = (event: any, panelHeading: any) => {
    const formValues = form.getFieldsValue();

    if (panelHeading === 'fuelCombustionActivities') {
      const sum =
        (formValues.fuelCombustionActivities_energyIndustries_n2o || 0) +
        (formValues.fuelCombustionActivities_manufacturingIndustriesConstruction_n2o || 0) +
        (formValues.fuelCombustionActivities_transport_n2o || 0) +
        (formValues.fuelCombustionActivities_otherSectors_n2o || 0) +
        (formValues.fuelCombustionActivities_nonSpecified_n2o || 0);
      setFuelCombustionActivitiesN2o(sum);
    }
    if (panelHeading === 'fugitiveEmissionsFromFuels') {
      const sum =
        (formValues.fugitiveEmissionsFromFuels_solidFuels_n2o || 0) +
        (formValues.fugitiveEmissionsFromFuels_oilNaturalGas_n2o || 0) +
        (formValues.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_n2o || 0);
      setFugitiveEmissionsFromFuelsN2o(sum);
    }
    if (panelHeading === 'carbonDioxideTransportStorage') {
      const sum =
        (formValues.carbonDioxideTransportStorage_transportOfCo2_n2o || 0) +
        (formValues.carbonDioxideTransportStorage_injectionStorage_n2o || 0) +
        (formValues.carbonDioxideTransportStorage_other_n2o || 0);
      setCarbonDioxideTransportStorageN2o(sum);
    }
    if (panelHeading === 'industrialProcessesProductUse') {
      const sum =
        (formValues.industrialProcessesProductUse_mineralIndustry_n2o || 0) +
        (formValues.industrialProcessesProductUse_chemicalIndustry_n2o || 0) +
        (formValues.industrialProcessesProductUse_metalIndustry_n2o || 0) +
        (formValues.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_n2o || 0) +
        (formValues.industrialProcessesProductUse_electronicsIndustry_n2o || 0) +
        (formValues.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_n2o || 0) +
        (formValues.industrialProcessesProductUse_otherProductManufactureUse_n2o || 0) +
        (formValues.industrialProcessesProductUse_other_n2o || 0);
      setIndustrialProcessesProductUseN2o(sum);
    }
    if (panelHeading === 'agricultureForestryOtherLandUse') {
      const sum =
        (formValues.agricultureForestryOtherLandUse_livestock_n2o || 0) +
        (formValues.agricultureForestryOtherLandUse_land_n2o || 0) +
        (formValues.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_n2o || 0) +
        (formValues.agricultureForestryOtherLandUse_other_n2o || 0);
      setAgricultureForestryOtherLandUseN2o(sum);
    }
    if (panelHeading === 'waste') {
      const sum =
        (formValues.waste_solidWasteDisposal_n2o || 0) +
        (formValues.waste_biologicalTreatmentSolidWaste_n2o || 0) +
        (formValues.waste_incinerationOpenBurningWaste_n2o || 0) +
        (formValues.waste_wastewaterTreatmentDischarge_n2o || 0) +
        (formValues.waste_other_n2o || 0);
      setWasteN2o(sum);
    }
    if (panelHeading === 'other') {
      const sum =
        (formValues.other_indirectN2oEmissions_n2o || 0) + (formValues.other_other_n2o || 0);
      setOtherN2o(sum);
    }
    return 0;
  };

  const calculateSumCo2Eq = (event: any, panelHeading: any) => {
    const formValues = form.getFieldsValue();

    if (panelHeading === 'fuelCombustionActivities') {
      const sum =
        (formValues.fuelCombustionActivities_energyIndustries_co2eq || 0) +
        (formValues.fuelCombustionActivities_manufacturingIndustriesConstruction_co2eq || 0) +
        (formValues.fuelCombustionActivities_transport_co2eq || 0) +
        (formValues.fuelCombustionActivities_otherSectors_co2eq || 0) +
        (formValues.fuelCombustionActivities_nonSpecified_co2eq || 0);
      setFuelCombustionActivitiesCo2Eq(sum);
    }
    if (panelHeading === 'fugitiveEmissionsFromFuels') {
      const sum =
        (formValues.fugitiveEmissionsFromFuels_solidFuels_co2eq || 0) +
        (formValues.fugitiveEmissionsFromFuels_oilNaturalGas_co2eq || 0) +
        (formValues.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_co2eq || 0);
      setFugitiveEmissionsFromFuelsCo2Eq(sum);
    }
    if (panelHeading === 'carbonDioxideTransportStorage') {
      const sum =
        (formValues.carbonDioxideTransportStorage_transportOfCo2_co2eq || 0) +
        (formValues.carbonDioxideTransportStorage_injectionStorage_co2eq || 0) +
        (formValues.carbonDioxideTransportStorage_other_co2eq || 0);
      setCarbonDioxideTransportStorageCo2Eq(sum);
    }
    if (panelHeading === 'industrialProcessesProductUse') {
      const sum =
        (formValues.industrialProcessesProductUse_mineralIndustry_co2eq || 0) +
        (formValues.industrialProcessesProductUse_chemicalIndustry_co2eq || 0) +
        (formValues.industrialProcessesProductUse_metalIndustry_co2eq || 0) +
        (formValues.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_co2eq || 0) +
        (formValues.industrialProcessesProductUse_electronicsIndustry_co2eq || 0) +
        (formValues.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_co2eq || 0) +
        (formValues.industrialProcessesProductUse_otherProductManufactureUse_co2eq || 0) +
        (formValues.industrialProcessesProductUse_other_co2eq || 0);
      setIndustrialProcessesProductUseCo2Eq(sum);
    }
    if (panelHeading === 'agricultureForestryOtherLandUse') {
      const sum =
        (formValues.agricultureForestryOtherLandUse_livestock_co2eq || 0) +
        (formValues.agricultureForestryOtherLandUse_land_co2eq || 0) +
        (formValues.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_co2eq || 0) +
        (formValues.agricultureForestryOtherLandUse_other_co2eq || 0);
      setAgricultureForestryOtherLandUseCo2Eq(sum);
    }
    if (panelHeading === 'waste') {
      const sum =
        (formValues.waste_solidWasteDisposal_co2eq || 0) +
        (formValues.waste_biologicalTreatmentSolidWaste_co2eq || 0) +
        (formValues.waste_incinerationOpenBurningWaste_co2eq || 0) +
        (formValues.waste_wastewaterTreatmentDischarge_co2eq || 0) +
        (formValues.waste_other_co2eq || 0);
      setWasteCo2Eq(sum);
    }
    if (panelHeading === 'other') {
      const sum =
        (formValues.other_indirectN2oEmissions_co2eq || 0) + (formValues.other_other_co2eq || 0);
      setOtherCo2Eq(sum);
    }
    return 0;
  };

  const getCO2Sum = (panelHeading: any) => {
    switch (panelHeading) {
      case 'energyEmissions':
        return energyEmissionsCo2;
      case 'fuelCombustionActivities':
        return fuelCombustionActivitiesCo2;
      case 'fugitiveEmissionsFromFuels':
        return fugitiveEmissionsFromFuelsCo2;
      case 'carbonDioxideTransportStorage':
        return carbonDioxideTransportStorageCo2;
      case 'industrialProcessesProductUse':
        return industrialProcessesProductUseCo2;
      case 'agricultureForestryOtherLandUse':
        return agricultureForestryOtherLandUseCo2;
      case 'waste':
        return wasteCo2;
      case 'other':
        return otherCo2;
      default:
        return 0;
    }
  };

  const getCH4Sum = (panelHeading: any) => {
    switch (panelHeading) {
      case 'energyEmissions':
        return energyEmissionsCh4;
      case 'fuelCombustionActivities':
        return fuelCombustionActivitiesCh4;
      case 'fugitiveEmissionsFromFuels':
        return fugitiveEmissionsFromFuelsCh4;
      case 'carbonDioxideTransportStorage':
        return carbonDioxideTransportStorageCh4;
      case 'industrialProcessesProductUse':
        return industrialProcessesProductUseCh4;
      case 'agricultureForestryOtherLandUse':
        return agricultureForestryOtherLandUseCh4;
      case 'waste':
        return wasteCh4;
      case 'other':
        return otherCh4;
      default:
        return 0;
    }
  };

  const getN2OSum = (panelHeading: any) => {
    switch (panelHeading) {
      case 'energyEmissions':
        return energyEmissionsN2o;
      case 'fuelCombustionActivities':
        return fuelCombustionActivitiesN2o;
      case 'fugitiveEmissionsFromFuels':
        return fugitiveEmissionsFromFuelsN2o;
      case 'carbonDioxideTransportStorage':
        return carbonDioxideTransportStorageN2o;
      case 'industrialProcessesProductUse':
        return industrialProcessesProductUseN2o;
      case 'agricultureForestryOtherLandUse':
        return agricultureForestryOtherLandUseN2o;
      case 'waste':
        return wasteN2o;
      case 'other':
        return otherN2o;
      default:
        return 0;
    }
  };

  const getCO2EQSum = (panelHeading: any) => {
    switch (panelHeading) {
      case 'energyEmissions':
        return energyEmissionsCo2Eq;
      case 'fuelCombustionActivities':
        return fuelCombustionActivitiesCo2Eq;
      case 'fugitiveEmissionsFromFuels':
        return fugitiveEmissionsFromFuelsCo2Eq;
      case 'carbonDioxideTransportStorage':
        return carbonDioxideTransportStorageCo2Eq;
      case 'industrialProcessesProductUse':
        return industrialProcessesProductUseCo2Eq;
      case 'agricultureForestryOtherLandUse':
        return agricultureForestryOtherLandUseCo2Eq;
      case 'waste':
        return wasteCo2Eq;
      case 'other':
        return otherCo2Eq;
      default:
        return 0;
    }
  };

  const renderPanelHeader = (panelHeading: any) => (
    <Row gutter={16}>
      <Col xl={12} md={12} className="panel-header-col">
        <span>{t(`ghgInventory:${panelHeading}`)}</span>
      </Col>
      <Col xl={9} md={9} className="panel-header-emission-value-col">
        <Row gutter={16}>
          <Col xl={6}>
            <div className="co2-total-pill">{getCO2Sum(panelHeading)}</div>
          </Col>
          <Col xl={6}>
            <div className="ch4-total-pill">{getCH4Sum(panelHeading)}</div>
          </Col>
          <Col xl={6}>
            <div className="n2o-total-pill">{getN2OSum(panelHeading)}</div>
          </Col>
          <Col xl={6}>
            <div className="co2eq-total-pill">{getCO2EQSum(panelHeading)}</div>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const renderPanelHeaderView = (panelHeading: any, tabData: any) => {
    const emissionsObject = tabData[panelHeading];

    return (
      <Row gutter={16}>
        <Col xl={12} md={12} className="panel-header-col">
          <span>{t(`ghgInventory:${panelHeading}`)}</span>
        </Col>
        <Col xl={9} md={9}>
          <Row gutter={16} className="panel-header-emission-value-col">
            <Col xl={6}>
              <div className="co2-total-pill">
                {calculateSumEmissionView(emissionsObject, 'co2')}
              </div>
            </Col>
            <Col xl={6}>
              <div className="ch4-total-pill">
                {calculateSumEmissionView(emissionsObject, 'ch4')}
              </div>
            </Col>
            <Col xl={6}>
              <div className="n2o-total-pill">
                {calculateSumEmissionView(emissionsObject, 'n2o')}
              </div>
            </Col>
            <Col xl={6}>
              <div className="co2eq-total-pill">
                {calculateSumEmissionView(emissionsObject, 'co2eq')}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const renderPanelContent = (panelHeading: any, item: any, index: any) => (
    <Row gutter={16} key={index} className="panel-content-row">
      <Col xl={12} md={12} className="panel-content-title">
        <span>{t(`ghgInventory:${item}`)}</span>
      </Col>
      <Col xl={9} md={9}>
        <Row gutter={16} className="panel-content-input-box-row">
          <Col xl={6}>
            <Form.Item name={panelHeading + '_' + item + '_co2'}>
              <InputNumber onChange={(event) => calculateSumCo2(event, panelHeading)} />
            </Form.Item>
          </Col>
          <Col xl={6}>
            <Form.Item name={panelHeading + '_' + item + '_ch4'}>
              <InputNumber onChange={(event) => calculateSumCh4(event, panelHeading)} />
            </Form.Item>
          </Col>
          <Col xl={6}>
            <Form.Item name={panelHeading + '_' + item + '_n2o'}>
              <InputNumber onChange={(event) => calculateSumN2o(event, panelHeading)} />
            </Form.Item>
          </Col>
          <Col xl={6}>
            <Form.Item name={panelHeading + '_' + item + '_co2eq'}>
              <InputNumber onChange={(event) => calculateSumCo2Eq(event, panelHeading)} />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const renderPanelContentView = (
    co2: any,
    ch4: any,
    n2o: any,
    co2eq: any,
    item: any,
    index: any
  ) => {
    return (
      <Row gutter={16} key={index} className="panel-content-row">
        <Col xl={12} md={12} className="panel-content-title">
          <span>{t(`ghgInventory:${item}`)}</span>
        </Col>
        <Col xl={9} md={9}>
          <Row gutter={16} className="panel-content-input-box-row">
            <Col xl={6}>
              <InputNumber value={co2} disabled />
            </Col>
            <Col xl={6}>
              <InputNumber value={ch4} disabled />
            </Col>
            <Col xl={6}>
              <InputNumber value={n2o} disabled />
            </Col>
            <Col xl={6}>
              <InputNumber value={co2eq} disabled />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <div className="content-container emission-tab-container">
        <div className="emission-title-bar">
          <div className="title-bar">
            <div className="body-title">{t(`ghgInventory:emissions`)}</div>
            <div className="body-sub-title">{t(`ghgInventory:totalNationalEmissionSubTitle`)}</div>
          </div>
        </div>
        <div className="content-card add-emission">
            
          <Tabs defaultActiveKey="Add New" centered>
          {(userInfoState?.companyRole === CompanyRole.GOVERNMENT || userInfoState?.companyRole === CompanyRole.MINISTRY) && (
            <Tabs.TabPane key="Add New" tab={t(`ghgInventory:addNew`)}>
              <div>
                <Form
                  labelCol={{ span: 20 }}
                  wrapperCol={{ span: 24 }}
                  name="add-emission"
                  className="programme-details-form"
                  layout="vertical"
                  requiredMark={true}
                  form={form}
                  onValuesChange={onValuesChange}
                  onFinish={onSubmitForm}
                >
                  <Row>
                    <Col xl={12} md={12} className="add-new-year-picker-col">
                      <div>
                        <Form.Item
                          label={t("ghgInventory:year")}
                          name="year"
                          rules={[
                            {
                              required: true,
                              message: "",
                            },
                            {
                              validator: async (rule, value) => {
                                if (
                                  String(value).trim() === "" ||
                                  String(value).trim() === undefined ||
                                  value === null ||
                                  value === undefined
                                ) {
                                  throw new Error(
                                    `${t("ghgInventory:year")} ${t(
                                      "isRequired"
                                    )}`
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <DatePicker
                            onChange={handleYearChange}
                            picker="year"
                            disabledDate={isYearDisabled}
                            size="large"
                            disabled = {isPendingFinalization}
                          />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col xl={12} md={12} className="add-new-upload-file-col">
                      <Row className="add-new-upload-file-label">
                        {t(`ghgInventory:emissionRemovalDocument`)}
                      </Row>
                      <Row>
                        <Col xl={5} md={5} className="add-new-upload-file-inner-col">
                          <Form.Item
                            name="emissionsDocument"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            required={true}
                          >
                            <Upload
                              accept=".xlsx"
                              showUploadList={false}
                              beforeUpload={(file) => {
                                if (!checkFile(file)) {
                                  message.open({
                                    type: 'error',
                                    content: t('ghgInventory:invalidFileType'),
                                    duration: 4,
                                    style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
                                  });
                                  return false;
                                }
                                // show an error message in UI
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const xldata = e.target?.result;
                                  if (xldata) {
                                    try {
                                      const workbook = XLSX.read(xldata, { type: 'array' });
                                      const sheetName = workbook.SheetNames[0];
                                      const sheet = workbook.Sheets[sheetName];

                                      const firstRow = XLSX.utils.sheet_to_json(sheet, {
                                        header: 1,
                                      })[0];
                                      if (!validateExcelDataFormat(firstRow)) {
                                        message.open({
                                          type: 'error',
                                          content: t('ghgInventory:invalidDataInExcel'),
                                          duration: 4,
                                          style: {
                                            textAlign: 'right',
                                            marginRight: 15,
                                            marginTop: 10,
                                          },
                                        });
                                        return false;
                                      }
                                      const excelData = XLSX.utils.sheet_to_json(sheet);
                                      handleFileUploadData(excelData);
                                      setUploadedFileName(file.name);
                                    } catch (error) {
                                      console.log(error, 'error', file);
                                    }
                                  }
                                };
                                reader.readAsArrayBuffer(file); // Use readAsArrayBuffer for Excel files

                                // Prevent upload
                                return false;
                              }}
                            >
                              <Button icon={<UploadOutlined />}>{t(`ghgInventory:upload`)}</Button>
                            </Upload>
                          </Form.Item>
                        </Col>
                        <Col xl={16} md={16} className="add-new-upload-file-name-input">
                          <Input value={uploadedFileName} readOnly />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={9} offset={12}>
                      <Row gutter={16} className="table-heading-row">
                        <Col xl={6} className="table-heading-col">
                          CO<sub>2</sub>
                        </Col>
                        <Col xl={6} className="table-heading-col">
                          CH<sub>4</sub>
                        </Col>
                        <Col xl={6} className="table-heading-col">
                          N<sub>2</sub>O
                        </Col>
                        <Col xl={6} className="table-heading-col">
                          CO<sub>2</sub>-eq
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={16} className="total-emission-row">
                    <Col xl={12} md={12}>
                      <span className="total-emission-title">
                        {t(`ghgInventory:totalNationalEmission`)}
                      </span>
                    </Col>
                    <Col xl={9} md={9}>
                      <Row gutter={16} className="total-emission-value-col">
                        <Col xl={6}>
                          <div className="co2-total-pill">{totalNationalCo2}</div>
                        </Col>
                        <Col xl={6}>
                          <div className="ch4-total-pill">{totalNationalCh4}</div>
                        </Col>
                        <Col xl={6}>
                          <div className="n2o-total-pill">{totalNationalN2o}</div>
                        </Col>
                        <Col xl={6}>
                          <div className="co2eq-total-pill">{totalNationalCo2Eq}</div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Collapse
                    ghost
                    expandIcon={({ isActive }) =>
                      isActive ? <MinusCircleOutlined /> : <PlusCircleOutlined />
                    }
                  >
                    {Object.entries(formFields).map(([panelHeading, panelContent]) => (
                      <Panel header={renderPanelHeader(panelHeading)} key={panelHeading}>
                        {Array.isArray(panelContent)
                          ? panelContent.map((item, index) =>
                              renderPanelContent(panelHeading, item, index)
                            )
                          : Object.entries(panelContent).map(
                              ([subPanelHeading, subPanelContent]) => (
                                <div className="sub-panel">
                                  <div className="sub-panel-heading">
                                    {renderPanelHeader(subPanelHeading)}
                                  </div>
                                  {subPanelContent.map((item, index) =>
                                    renderPanelContent(subPanelHeading, item, index)
                                  )}
                                </div>
                              )
                            )}
                      </Panel>
                    ))}
                  </Collapse>
                  <Row
                    gutter={16}
                    key={'totalCo2WithoutLand'}
                    className="total-co2-without-land-row"
                  >
                    <Col xl={12} md={12} className="total-co2-without-land-title">
                      <span>{t(`ghgInventory:totalCo2WithoutLand`)}</span>
                    </Col>
                    <Col xl={9} md={9}>
                      <Row gutter={16} className="panel-content-input-box-row">
                        <Col xl={6}>
                          <Form.Item name="totalCo2WithoutLand_co2">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={6}>
                          <Form.Item name="totalCo2WithoutLand_ch4">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={6}>
                          <Form.Item name="totalCo2WithoutLand_n2o">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={6}>
                          <Form.Item name="totalCo2WithoutLand_co2eq">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={16} key={'totalCo2WithLand'} className="total-co2-with-land-row">
                    <Col xl={12} md={12} className="total-co2-with-land-title">
                      <span>{t(`ghgInventory:totalCo2WithLand`)}</span>
                    </Col>
                    <Col xl={9} md={9}>
                      <Row gutter={16} className="panel-content-input-box-row">
                        <Col xl={6}>
                          <Form.Item name="totalCo2WithLand_co2">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={6}>
                          <Form.Item name="totalCo2WithLand_ch4">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={6}>
                          <Form.Item name="totalCo2WithLand_n2o">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={6}>
                          <Form.Item name="totalCo2WithLand_co2eq">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <div className="steps-actions">
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {/* {t('addProgramme:submit')} */}
                      Submit
                    </Button>
                    <Button
                      className="back-btn"
                      // onClick={() => prevOne()}
                      loading={loading}
                    >
                      {/* {t('addProgramme:back')} */}
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </Tabs.TabPane>)}

            {data.map(
              (tabData: any) =>
                tabData.state === 'FINALIZED' && (
                  <Tabs.TabPane
                    key={tabData.id.toString()}
                    tab={
                      <span>
                        {tabData.year}
                        {tabData.state === 'FINALIZED' && <LockFilled style={{ marginLeft: 5 }} />}
                      </span>
                    }
                  >
                    <div>
                      <Row>
                        <Col xl={12} md={12} className="add-new-year-picker-col">
                          <div>
                            <Row className="add-new-upload-file-label">Year</Row>
                            <DatePicker
                              //   onChange={handleYearChange}
                              picker="year"
                              disabledDate={isYearDisabled}
                              defaultValue={moment(tabData.year, 'YYYY')}
                              disabled
                              size="large"
                            />
                          </div>
                        </Col>
                        <Col xl={12} md={12} className="add-new-upload-file-col">
                          <Row className="add-new-upload-file-label">
                            {t(`ghgInventory:emissionRemovalDocument`)}
                          </Row>
                          <Row>
                            <Col xl={5} md={5} className="add-new-upload-file-inner-col">
                              <Form.Item>
                                <Upload
                                  accept=".xlsx"
                                  customRequest={({ onSuccess, onError, file }) => {
                                    const reader = new FileReader();

                                    reader.onload = (e) => {
                                      if (e && e.target) {
                                        // Check if e and e.target are defined
                                        const xldata = e.target.result;
                                        if (xldata) {
                                          try {
                                            const workbook = XLSX.read(xldata, { type: 'array' });
                                            const sheetName = workbook.SheetNames[0];
                                            const sheet = workbook.Sheets[sheetName];
                                            const excelData = XLSX.utils.sheet_to_json(sheet);

                                            // Use excelData as needed, e.g., display it in a table.
                                            console.log(excelData);

                                            // You can perform any further processing with the data here.
                                            // For example, you can call a function to handle the uploaded data.
                                            // handleFileUpload(excelData);

                                            //   onSuccess('ok', file);
                                          } catch (error) {
                                            //   onError(error, 'error', file);
                                          }
                                        } else {
                                          // onError(new Error('File upload failed'), 'error', file);
                                        }
                                      } else {
                                        //   onError(
                                        //     new Error('Event or target is undefined'),
                                        //     'error',
                                        //     file
                                        //   );
                                      }
                                    };

                                    //   reader.readAsArrayBuffer(file);
                                  }}
                                >
                                  <Button icon={<UploadOutlined />}>
                                    {t(`ghgInventory:upload`)}
                                  </Button>
                                </Upload>
                              </Form.Item>
                            </Col>
                            <Col xl={16} md={16} className="add-new-upload-file-name-input">
                              <Input value={uploadedFileName} readOnly />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={9} offset={12}>
                          <Row gutter={16} className="table-heading-row">
                            <Col xl={6} className="table-heading-col">
                              CO<sub>2</sub>
                            </Col>
                            <Col xl={6} className="table-heading-col">
                              CH<sub>4</sub>
                            </Col>
                            <Col xl={6} className="table-heading-col">
                              N<sub>2</sub>O
                            </Col>
                            <Col xl={6} className="table-heading-col">
                              CO<sub>2</sub>-eq
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row gutter={16} className="total-emission-row">
                        <Col xl={12} md={12}>
                          <span>{t(`ghgInventory:totalNationalEmission`)}</span>
                        </Col>
                        <Col xl={9} md={9} className="total-emission-value-col">
                          <Row gutter={16}>
                            <Col xl={6}>
                              <div className="co2-total-pill">
                                {calculateSumEmissionView(tabData, 'co2')}
                              </div>
                            </Col>
                            <Col xl={6}>
                              <div className="ch4-total-pill">
                                {calculateSumEmissionView(tabData, 'ch4')}
                              </div>
                            </Col>
                            <Col xl={6}>
                              <div className="n2o-total-pill">
                                {calculateSumEmissionView(tabData, 'n2o')}
                              </div>
                            </Col>
                            <Col xl={6}>
                              <div className="co2eq-total-pill">
                                {calculateSumEmissionView(tabData, 'co2eq')}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Collapse
                        ghost
                        expandIcon={({ isActive }) =>
                          isActive ? <MinusCircleOutlined /> : <PlusCircleOutlined />
                        }
                      >
                        {Object.entries(formFields).map(([panelHeading, panelContent]) => (
                          <Panel
                            header={renderPanelHeaderView(panelHeading, tabData)}
                            key={panelHeading}
                          >
                            {Array.isArray(panelContent)
                              ? panelContent.map((item, index) => {
                                  for (const key in tabData) {
                                    if (key === panelHeading) {
                                      const emissionsObject = tabData[key];
                                      const emissionsData = emissionsObject[item];
                                      return renderPanelContentView(
                                        emissionsData?.co2,
                                        emissionsData?.ch4,
                                        emissionsData?.n2o,
                                        emissionsData?.co2eq,
                                        item,
                                        index
                                      );
                                    }
                                  }
                                })
                              : Object.entries(panelContent).map(
                                  ([subPanelHeading, subPanelContent]) => (
                                    <div className="sub-panel">
                                      <div className="sub-panel-heading">
                                        {renderPanelHeaderView(
                                          subPanelHeading,
                                          tabData.energyEmissions
                                        )}
                                      </div>
                                      {subPanelContent.map((item, index) => {
                                        for (const key in tabData.energyEmissions[
                                          subPanelHeading
                                        ]) {
                                          if (key === item) {
                                            const emissionsObject =
                                              tabData.energyEmissions[subPanelHeading];
                                            const emissionsData = emissionsObject[item];
                                            return renderPanelContentView(
                                              emissionsData?.co2,
                                              emissionsData?.ch4,
                                              emissionsData?.n2o,
                                              emissionsData?.co2eq,
                                              item,
                                              index
                                            );
                                          }
                                        }
                                      })}
                                    </div>
                                  )
                                )}
                          </Panel>
                        ))}
                      </Collapse>
                    </div>
                  </Tabs.TabPane>
                )
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};
