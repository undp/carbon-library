import { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './projections.scss';
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
import { EmissionSectors, formFields } from '../emission.mappings';
import { ProjectionTypes } from '../projection.types';
import React from 'react';
import { CompanyRole } from '../../../Definitions';
import { RcFile } from 'antd/lib/upload';
import { HttpStatusCode } from 'axios';

export const GHGProjectionsComponent = (props: any) => {
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
          energyIndustries: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 332,
          },
          manufacturingIndustriesConstruction: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          transport: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          otherSectors: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          nonSpecified: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
        },
        fugitiveEmissionsFromFuels: {
          solidFuels: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          oilNaturalGas: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          otherEmissionsEnergyProduction: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
        },
        carbonDioxideTransportStorage: {
          transportOfCo2: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          injectionStorage: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          other: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
        },
      },
      industrialProcessesProductUse: {
        mineralIndustry: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        chemicalIndustry: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        metalIndustry: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        nonEnergyProductsFuelsSolventUse: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        electronicsIndustry: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        productUsesSubstOzoneDepletingSubs: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        otherProductManufactureUse: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        other: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
      },
      agricultureForestryOtherLandUse: {
        livestock: { bau: 20, conditionalNdc: 15, unconditionalNdc: 33 },
        land: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        aggregateNonCo2SourcesLand: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        other: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
      },
      waste: {
        solidWasteDisposal: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        biologicalTreatmentSolidWaste: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        incinerationOpenBurningWaste: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        wastewaterTreatmentDischarge: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        other: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
      },
      other: {
        indirectN2oEmissions: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        other: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
      },
      totalCo2WithoutLand: {
        bau: 20,
        conditionalNdc: 15,
        unconditionalNdc: 33,
      },
      totalCo2WithLand: {
        bau: 20,
        conditionalNdc: 15,
        unconditionalNdc: 33,
      },
      state: 'FINALIZED',
      version: 1,
      created_at: 1698644100397,
    },
    {
      id: 2,
      country: 'NG',
      year: 2022,
      energyEmissions: {
        fuelCombustionActivities: {
          energyIndustries: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          manufacturingIndustriesConstruction: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          transport: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          otherSectors: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          nonSpecified: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
        },
        fugitiveEmissionsFromFuels: {
          solidFuels: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          oilNaturalGas: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          otherEmissionsEnergyProduction: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
        },
        carbonDioxideTransportStorage: {
          transportOfCo2: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          injectionStorage: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
          other: {
            bau: 20,
            conditionalNdc: 15,
            unconditionalNdc: 33,
          },
        },
      },
      industrialProcessesProductUse: {
        mineralIndustry: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        chemicalIndustry: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        metalIndustry: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        nonEnergyProductsFuelsSolventUse: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        electronicsIndustry: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        productUsesSubstOzoneDepletingSubs: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        otherProductManufactureUse: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        other: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
      },
      agricultureForestryOtherLandUse: {
        livestock: { bau: 20, conditionalNdc: 15, unconditionalNdc: 33 },
        land: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        aggregateNonCo2SourcesLand: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        other: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
      },
      waste: {
        solidWasteDisposal: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        biologicalTreatmentSolidWaste: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        incinerationOpenBurningWaste: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        wastewaterTreatmentDischarge: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        other: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
      },
      other: {
        indirectN2oEmissions: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
        other: {
          bau: 20,
          conditionalNdc: 15,
          unconditionalNdc: 33,
        },
      },
      totalCo2WithoutLand: {
        bau: 20,
        conditionalNdc: 15,
        unconditionalNdc: 33,
      },
      totalCo2WithLand: {
        bau: 20,
        conditionalNdc: 15,
        unconditionalNdc: 33,
      },
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

  const [totalNationalBau, setTotalNationalBau] = useState<number>(0);
  const [totalNationalConditionalNdc, setTotalNationalConditionalNdc] = useState<number>(0);
  const [totalNationalUnconditionalNdc, setTotalNationalUnconditionalNdc] = useState<number>(0);

  const [energyEmissionsBau, setEnergyEmissionsBau] = useState<number>(0);
  const [energyEmissionsConditionalNdc, setEnergyEmissionsConditionalNdc] = useState<number>(0);
  const [energyEmissionsUnconditionalNdc, setEnergyEmissionsUnconditionalNdc] = useState<number>(0);

  const [fuelCombustionActivitiesBau, setFuelCombustionActivitiesBau] = useState<number>(0);
  const [fuelCombustionActivitiesConditionalNdc, setFuelCombustionActivitiesConditionalNdc] =
    useState<number>(0);
  const [fuelCombustionActivitiesUnconditionalNdc, setFuelCombustionActivitiesUnconditionalNdc] =
    useState<number>(0);

  const [fugitiveEmissionsFromFuelsBau, setFugitiveEmissionsFromFuelsBau] = useState<number>(0);
  const [fugitiveEmissionsFromFuelsConditionalNdc, setFugitiveEmissionsFromFuelsConditionalNdc] =
    useState<number>(0);
  const [
    fugitiveEmissionsFromFuelsUnconditionalNdc,
    setFugitiveEmissionsFromFuelsUnconditionalNdc,
  ] = useState<number>(0);

  const [carbonDioxideTransportStorageBau, setCarbonDioxideTransportStorageBau] =
    useState<number>(0);
  const [
    carbonDioxideTransportStorageConditionalNdc,
    setCarbonDioxideTransportStorageConditionalNdc,
  ] = useState<number>(0);
  const [
    carbonDioxideTransportStorageUnconditionalNdc,
    setCarbonDioxideTransportStorageUnconditionalNdc,
  ] = useState<number>(0);

  const [industrialProcessesProductUseBau, setIndustrialProcessesProductUseBau] =
    useState<number>(0);
  const [
    industrialProcessesProductUseConditionalNdc,
    setIndustrialProcessesProductUseConditionalNdc,
  ] = useState<number>(0);
  const [
    industrialProcessesProductUseUnconditionalNdc,
    setIndustrialProcessesProductUseUnconditionalNdc,
  ] = useState<number>(0);

  const [agricultureForestryOtherLandUseBau, setAgricultureForestryOtherLandUseBau] =
    useState<number>(0);
  const [
    agricultureForestryOtherLandUseConditionalNdc,
    setAgricultureForestryOtherLandUseConditionalNdc,
  ] = useState<number>(0);
  const [
    agricultureForestryOtherLandUseUnconditionalNdc,
    setAgricultureForestryOtherLandUseUnconditionalNdc,
  ] = useState<number>(0);

  const [wasteBau, setWasteBau] = useState<number>(0);
  const [wasteConditionalNdc, setWasteConditionalNdc] = useState<number>(0);
  const [wasteUnconditionalNdc, setWasteUnconditionalNdc] = useState<number>(0);

  const [otherBau, setOtherBau] = useState<number>(0);
  const [otherConditionalNdc, setOtherConditionalNdc] = useState<number>(0);
  const [otherUnconditionalNdc, setOtherUnconditionalNdc] = useState<number>(0);

  const [isSavedFormDataSet, setIsSavedFormDataSet] = useState<boolean>(false);

  const { Panel } = Collapse;
  const [form] = Form.useForm();

  const createSetFieldObject = (obj: any, objName: string) => {
    const result: any = {};

    for (const key in obj) {
      console.log('key', key);

      const energyEmissionsSub = obj[key];
      for (const childKey in energyEmissionsSub) {
        if (typeof energyEmissionsSub[childKey] === 'object') {
          console.log('energyEmissionsSub', energyEmissionsSub);
          for (const category in energyEmissionsSub) {
            console.log('category', category);
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
    const columnHeadings = ['Sector', 'Business As Usual', 'Conditional NDC', 'Unconditional NDC'];
    return sheetHeadings.every((element: any) => columnHeadings.includes(element));
  };

  const populateFormWithUploadedFile = (excelData: any, keyPrefix: string) => {
    const result: any = {};
    const emissions: any = {};
    for (const key in ProjectionTypes) {
      emissions[key] = excelData[ProjectionTypes[key]];
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

  function calculateSumEmissionView(obj: any, conditionType: string) {
    let sum = 0;
    for (const key in obj) {
      if (key === conditionType) {
        sum += obj[key];
      } else if (
        typeof obj[key] === 'object' &&
        key !== 'totalCo2WithLand' &&
        key !== 'totalCo2WithoutLand'
      ) {
        sum += calculateSumEmissionView(obj[key], conditionType);
      }
    }
    return sum;
  }

  const onValuesChange = (changedValues2: any, allValues: any) => {
    // Track the changed values
    console.log(
      '=================onValuesChange changedValues, allValues',
      changedValues2,
      allValues
    );
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
            bau: fields?.fuelCombustionActivities_energyIndustries_bau,
            conditionalNdc: fields?.fuelCombustionActivities_energyIndustries_conditionalNdc,
            unconditionalNdc: fields?.fuelCombustionActivities_energyIndustries_unconditionalNdc,
          },
          manufacturingIndustriesConstruction: {
            bau: fields?.fuelCombustionActivities_manufacturingIndustriesConstruction_bau,
            conditionalNdc: fields?.fuelCombustionActivities_manufacturingIndustriesConstruction_conditionalNdc,
            unconditionalNdc: fields?.fuelCombustionActivities_manufacturingIndustriesConstruction_unconditionalNdc,
          },
          transport: {
            bau: fields?.fuelCombustionActivities_transport_bau,
            conditionalNdc: fields?.fuelCombustionActivities_transport_conditionalNdc,
            unconditionalNdc: fields?.fuelCombustionActivities_transport_unconditionalNdc,
          },
          otherSectors: {
            bau: fields?.fuelCombustionActivities_otherSectors_bau,
            conditionalNdc: fields?.fuelCombustionActivities_otherSectors_conditionalNdc,
            unconditionalNdc: fields?.fuelCombustionActivities_otherSectors_unconditionalNdc,
          },
          nonSpecified: {
            bau: fields?.fuelCombustionActivities_nonSpecified_bau,
            conditionalNdc: fields?.fuelCombustionActivities_nonSpecified_conditionalNdc,
            unconditionalNdc: fields?.fuelCombustionActivities_nonSpecified_unconditionalNdc,
          },
        },
        fugitiveEmissionsFromFuels: {
          solidFuels: {
            bau: fields?.fugitiveEmissionsFromFuels_solidFuels_bau,
            conditionalNdc: fields?.fugitiveEmissionsFromFuels_solidFuels_conditionalNdc,
            unconditionalNdc: fields?.fugitiveEmissionsFromFuels_solidFuels_unconditionalNdc,
          },
          oilNaturalGas: {
            bau: fields?.fugitiveEmissionsFromFuels_oilNaturalGas_bau,
            conditionalNdc: fields?.fugitiveEmissionsFromFuels_oilNaturalGas_conditionalNdc,
            unconditionalNdc: fields?.fugitiveEmissionsFromFuels_oilNaturalGas_unconditionalNdc,
          },
          otherEmissionsEnergyProduction: {
            bau: fields?.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_bau,
            conditionalNdc: fields?.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_conditionalNdc,
            unconditionalNdc: fields?.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_unconditionalNdc,
          },
        },
        carbonDioxideTransportStorage: {
          transportOfCo2: {
            bau: fields?.carbonDioxideTransportStorage_transportOfCo2_bau,
            conditionalNdc: fields?.carbonDioxideTransportStorage_transportOfCo2_conditionalNdc,
            unconditionalNdc: fields?.carbonDioxideTransportStorage_transportOfCo2_unconditionalNdc,
          },
          injectionStorage: {
            bau: fields?.carbonDioxideTransportStorage_injectionStorage_bau,
            conditionalNdc: fields?.carbonDioxideTransportStorage_injectionStorage_conditionalNdc,
            unconditionalNdc: fields?.carbonDioxideTransportStorage_injectionStorage_unconditionalNdc,
          },
          other: {
            bau: fields?.carbonDioxideTransportStorage_other_bau,
            conditionalNdc: fields?.carbonDioxideTransportStorage_other_conditionalNdc,
            unconditionalNdc: fields?.carbonDioxideTransportStorage_other_unconditionalNdc,
          },
        },
      },
      industrialProcessesProductUse: {
        mineralIndustry: {
          bau: fields?.industrialProcessesProductUse_mineralIndustry_bau,
          conditionalNdc: fields?.industrialProcessesProductUse_mineralIndustry_conditionalNdc,
          unconditionalNdc: fields?.industrialProcessesProductUse_mineralIndustry_unconditionalNdc,
        },
        chemicalIndustry: {
          bau: fields?.industrialProcessesProductUse_chemicalIndustry_bau,
          conditionalNdc: fields?.industrialProcessesProductUse_chemicalIndustry_conditionalNdc,
          unconditionalNdc: fields?.industrialProcessesProductUse_chemicalIndustry_unconditionalNdc,
        },
        metalIndustry: {
          bau: fields?.industrialProcessesProductUse_metalIndustry_bau,
          conditionalNdc: fields?.industrialProcessesProductUse_metalIndustry_conditionalNdc,
          unconditionalNdc: fields?.industrialProcessesProductUse_metalIndustry_unconditionalNdc,
        },
        nonEnergyProductsFuelsSolventUse: {
          bau: fields?.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_bau,
          conditionalNdc: fields?.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_conditionalNdc,
          unconditionalNdc: fields?.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_unconditionalNdc,
        },
        electronicsIndustry: {
          bau: fields?.industrialProcessesProductUse_electronicsIndustry_bau,
          conditionalNdc: fields?.industrialProcessesProductUse_electronicsIndustry_conditionalNdc,
          unconditionalNdc: fields?.industrialProcessesProductUse_electronicsIndustry_unconditionalNdc,
        },
        productUsesSubstOzoneDepletingSubs: {
          bau: fields?.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_bau,
          conditionalNdc: fields?.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_conditionalNdc,
          unconditionalNdc: fields?.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_unconditionalNdc,
        },
        otherProductManufactureUse: {
          bau: fields?.industrialProcessesProductUse_otherProductManufactureUse_bau,
          conditionalNdc: fields?.industrialProcessesProductUse_otherProductManufactureUse_conditionalNdc,
          unconditionalNdc: fields?.industrialProcessesProductUse_otherProductManufactureUse_unconditionalNdc,
        },
        other: {
          bau: fields?.industrialProcessesProductUse_other_bau,
          conditionalNdc: fields?.industrialProcessesProductUse_other_conditionalNdc,
          unconditionalNdc: fields?.industrialProcessesProductUse_other_unconditionalNdc,
        },
      },
      agricultureForestryOtherLandUse: {
        livestock: {
          bau: fields?.agricultureForestryOtherLandUse_livestock_bau,
          conditionalNdc: fields?.agricultureForestryOtherLandUse_livestock_conditionalNdc,
          unconditionalNdc: fields?.agricultureForestryOtherLandUse_livestock_unconditionalNdc,
        },
        land: {
          bau: fields?.agricultureForestryOtherLandUse_land_bau,
          conditionalNdc: fields?.agricultureForestryOtherLandUse_land_conditionalNdc,
          unconditionalNdc: fields?.agricultureForestryOtherLandUse_land_unconditionalNdc,
        },
        aggregateNonCo2SourcesLand: {
          bau: fields?.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_bau,
          conditionalNdc: fields?.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_conditionalNdc,
          unconditionalNdc: fields?.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_unconditionalNdc,
        },
        other: {
          bau: fields?.agricultureForestryOtherLandUse_other_bau,
          conditionalNdc: fields?.agricultureForestryOtherLandUse_other_conditionalNdc,
          unconditionalNdc: fields?.agricultureForestryOtherLandUse_other_unconditionalNdc,
        },
      },
      waste: {
        solidWasteDisposal: {
          bau: fields?.waste_solidWasteDisposal_bau,
          conditionalNdc: fields?.waste_solidWasteDisposal_conditionalNdc,
          unconditionalNdc: fields?.waste_solidWasteDisposal_unconditionalNdc,
        },
        biologicalTreatmentSolidWaste: {
          bau: fields?.waste_biologicalTreatmentSolidWaste_bau,
          conditionalNdc: fields?.waste_biologicalTreatmentSolidWaste_conditionalNdc,
          unconditionalNdc: fields?.waste_biologicalTreatmentSolidWaste_unconditionalNdc,
        },
        incinerationOpenBurningWaste: {
          bau: fields?.waste_incinerationOpenBurningWaste_bau,
          conditionalNdc: fields?.waste_incinerationOpenBurningWaste_conditionalNdc,
          unconditionalNdc: fields?.waste_incinerationOpenBurningWaste_unconditionalNdc,
        },
        wastewaterTreatmentDischarge: {
          bau: fields?.waste_wastewaterTreatmentDischarge_bau,
          conditionalNdc: fields?.waste_wastewaterTreatmentDischarge_conditionalNdc,
          unconditionalNdc: fields?.waste_wastewaterTreatmentDischarge_unconditionalNdc,
        },
        other: {
          bau: fields?.waste_other_bau,
          conditionalNdc: fields?.waste_other_conditionalNdc,
          unconditionalNdc: fields?.waste_other_unconditionalNdc,
        },
      },
      other: {
        indirectN2oEmissions: {
          bau: fields?.other_indirectN2oEmissions_bau,
          conditionalNdc: fields?.other_indirectN2oEmissions_conditionalNdc,
          unconditionalNdc: fields?.other_indirectN2oEmissions_unconditionalNdc,
        },
        other: {
          bau: fields?.other_other_bau,
          conditionalNdc: fields?.other_other_conditionalNdc,
          unconditionalNdc: fields?.other_other_unconditionalNdc,
        },
      },
      totalCo2WithoutLand: {
        bau: fields?.totalCo2WithoutLand_bau,
        conditionalNdc: fields?.totalCo2WithoutLand_conditionalNdc,
        unconditionalNdc: fields?.totalCo2WithoutLand_unconditionalNdc,
      },
      totalCo2WithLand: {
        bau: fields?.totalCo2WithLand_bau,
        conditionalNdc: fields?.totalCo2WithLand_conditionalNdc,
        unconditionalNdc: fields?.totalCo2WithLand_unconditionalNdc,
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
      const response: any = await post('national/projections', payload);
      console.log('Projections creation -> ', response);
      if (response?.statusText === 'SUCCESS') {
        message.open({
          type: 'success',
          content: response?.status == HttpStatusCode.Created ? t('ghgInventory:projectionCreationSuccess') : t('ghgInventory:projectionUpdateSuccess'),
          duration: 4,
          style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
        });
      }
    } catch (error: any) {
      console.log('Error in projection creation - ', error);
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


  const setFormValues = (projectionObject: any) => {
    if (projectionObject.year) {
      form.setFieldsValue({ year: moment(projectionObject.year, 'YYYY') });
    }
    form.setFieldsValue(createSetFieldObject(projectionObject.energyEmissions, 'energyEmissions'));
    form.setFieldsValue(
      createSetFieldObject(
        projectionObject.industrialProcessesProductUse,
        'industrialProcessesProductUse'
      )
    );
    form.setFieldsValue(
      createSetFieldObject(
        projectionObject.agricultureForestryOtherLandUse,
        'agricultureForestryOtherLandUse'
      )
    );
    form.setFieldsValue(createSetFieldObject(projectionObject.waste, 'waste'));
    form.setFieldsValue(createSetFieldObject(projectionObject.other, 'other'));
    form.setFieldsValue({
      totalCo2WithoutLand_bau: projectionObject.totalCo2WithoutLand.bau,
      totalCo2WithoutLand_conditionalNdc: projectionObject.totalCo2WithoutLand.conditionalNdc,
      totalCo2WithoutLand_unconditionalNdc: projectionObject.totalCo2WithoutLand.unconditionalNdc,
    });
    form.setFieldsValue({
      totalCo2WithLand_bau: projectionObject.totalCo2WithLand.bau,
      totalCo2WithLand_conditionalNdc: projectionObject.totalCo2WithLand.conditionalNdc,
      totalCo2WithLand_unconditionalNdc: projectionObject.totalCo2WithLand.unconditionalNdc,
    });

    setFuelCombustionActivitiesBau(
      calculateSumEmissionView(projectionObject?.energyEmissions.fuelCombustionActivities, 'bau')
    );
    setFuelCombustionActivitiesConditionalNdc(
      calculateSumEmissionView(
        projectionObject?.energyEmissions.fuelCombustionActivities,
        'conditionalNdc'
      )
    );
    setFuelCombustionActivitiesUnconditionalNdc(
      calculateSumEmissionView(
        projectionObject?.energyEmissions.fuelCombustionActivities,
        'unconditionalNdc'
      )
    );

    setFugitiveEmissionsFromFuelsBau(
      calculateSumEmissionView(projectionObject?.energyEmissions.fugitiveEmissionsFromFuels, 'bau')
    );
    setFugitiveEmissionsFromFuelsConditionalNdc(
      calculateSumEmissionView(
        projectionObject?.energyEmissions.fugitiveEmissionsFromFuels,
        'conditionalNdc'
      )
    );
    setFugitiveEmissionsFromFuelsUnconditionalNdc(
      calculateSumEmissionView(
        projectionObject?.energyEmissions.fugitiveEmissionsFromFuels,
        'unconditionalNdc'
      )
    );

    setCarbonDioxideTransportStorageBau(
      calculateSumEmissionView(
        projectionObject?.energyEmissions.carbonDioxideTransportStorage,
        'bau'
      )
    );
    setCarbonDioxideTransportStorageConditionalNdc(
      calculateSumEmissionView(
        projectionObject?.energyEmissions.carbonDioxideTransportStorage,
        'conditionalNdc'
      )
    );
    setCarbonDioxideTransportStorageUnconditionalNdc(
      calculateSumEmissionView(
        projectionObject?.energyEmissions.carbonDioxideTransportStorage,
        'unconditionalNdc'
      )
    );

    setIndustrialProcessesProductUseBau(
      calculateSumEmissionView(projectionObject?.industrialProcessesProductUse, 'bau')
    );
    setIndustrialProcessesProductUseConditionalNdc(
      calculateSumEmissionView(projectionObject?.industrialProcessesProductUse, 'conditionalNdc')
    );
    setIndustrialProcessesProductUseUnconditionalNdc(
      calculateSumEmissionView(projectionObject?.industrialProcessesProductUse, 'unconditionalNdc')
    );

    setAgricultureForestryOtherLandUseBau(
      calculateSumEmissionView(projectionObject?.agricultureForestryOtherLandUse, 'bau')
    );
    setAgricultureForestryOtherLandUseConditionalNdc(
      calculateSumEmissionView(projectionObject?.agricultureForestryOtherLandUse, 'conditionalNdc')
    );
    setAgricultureForestryOtherLandUseUnconditionalNdc(
      calculateSumEmissionView(
        projectionObject?.agricultureForestryOtherLandUse,
        'unconditionalNdc'
      )
    );

    setWasteBau(
      calculateSumEmissionView(projectionObject?.waste, 'bau')
    );
    setWasteConditionalNdc(
      calculateSumEmissionView(projectionObject?.waste, 'conditionalNdc')
    );
    setWasteUnconditionalNdc(
      calculateSumEmissionView(projectionObject?.waste, 'unconditionalNdc')
    );

    setOtherBau(
      calculateSumEmissionView(projectionObject?.other, 'bau')
    );
    setOtherConditionalNdc(
      calculateSumEmissionView(projectionObject?.other, 'conditionalNdc')
    );
    setOtherUnconditionalNdc(
      calculateSumEmissionView(projectionObject?.other, 'unconditionalNdc')
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

  const handleYearChange = (date: any, dateString: string) => {
    setSelectedYear(dateString);
  };

  const isYearDisabled = (current: any) => {
    return disabledYears.includes(current.year());
  };

  useEffect(() => {
    setEnergyEmissionsBau(
      fuelCombustionActivitiesBau + fugitiveEmissionsFromFuelsBau + carbonDioxideTransportStorageBau
    );
  }, [
    fuelCombustionActivitiesBau,
    fugitiveEmissionsFromFuelsBau,
    carbonDioxideTransportStorageBau,
  ]);

  useEffect(() => {
    setTotalNationalBau(
      energyEmissionsBau +
        industrialProcessesProductUseBau +
        agricultureForestryOtherLandUseBau +
        wasteBau +
        otherBau
    );
  }, [
    energyEmissionsBau +
      industrialProcessesProductUseBau +
      agricultureForestryOtherLandUseBau +
      wasteBau +
      otherBau,
  ]);

  useEffect(() => {
    setEnergyEmissionsConditionalNdc(
      fuelCombustionActivitiesConditionalNdc +
        fugitiveEmissionsFromFuelsConditionalNdc +
        carbonDioxideTransportStorageConditionalNdc
    );
  }, [
    fuelCombustionActivitiesConditionalNdc,
    fugitiveEmissionsFromFuelsConditionalNdc,
    carbonDioxideTransportStorageConditionalNdc,
  ]);

  useEffect(() => {
    setTotalNationalConditionalNdc(
      energyEmissionsConditionalNdc +
        industrialProcessesProductUseConditionalNdc +
        agricultureForestryOtherLandUseConditionalNdc +
        wasteConditionalNdc +
        otherConditionalNdc
    );
  }, [
    energyEmissionsConditionalNdc +
      industrialProcessesProductUseConditionalNdc +
      agricultureForestryOtherLandUseConditionalNdc +
      wasteConditionalNdc +
      otherConditionalNdc,
  ]);

  useEffect(() => {
    setEnergyEmissionsUnconditionalNdc(
      fuelCombustionActivitiesUnconditionalNdc +
        fugitiveEmissionsFromFuelsUnconditionalNdc +
        carbonDioxideTransportStorageUnconditionalNdc
    );
  }, [
    fuelCombustionActivitiesUnconditionalNdc,
    fugitiveEmissionsFromFuelsUnconditionalNdc,
    carbonDioxideTransportStorageUnconditionalNdc,
  ]);

  useEffect(() => {
    setTotalNationalUnconditionalNdc(
      energyEmissionsUnconditionalNdc +
        industrialProcessesProductUseUnconditionalNdc +
        agricultureForestryOtherLandUseUnconditionalNdc +
        wasteUnconditionalNdc +
        otherUnconditionalNdc
    );
  }, [
    energyEmissionsUnconditionalNdc +
      industrialProcessesProductUseUnconditionalNdc +
      agricultureForestryOtherLandUseUnconditionalNdc +
      wasteUnconditionalNdc +
      otherUnconditionalNdc,
  ]);

  const getBauSum = (panelHeading: any) => {
    switch (panelHeading) {
      case 'energyEmissions':
        return energyEmissionsBau;
      case 'fuelCombustionActivities':
        return fuelCombustionActivitiesBau;
      case 'fugitiveEmissionsFromFuels':
        return fugitiveEmissionsFromFuelsBau;
      case 'carbonDioxideTransportStorage':
        return carbonDioxideTransportStorageBau;
      case 'industrialProcessesProductUse':
        return industrialProcessesProductUseBau;
      case 'agricultureForestryOtherLandUse':
        return agricultureForestryOtherLandUseBau;
      case 'waste':
        return wasteBau;
      case 'other':
        return otherBau;
      default:
        return 0;
    }
  };

  const getConditionalNdcSum = (panelHeading: any) => {
    switch (panelHeading) {
      case 'energyEmissions':
        return energyEmissionsConditionalNdc;
      case 'fuelCombustionActivities':
        return fuelCombustionActivitiesConditionalNdc;
      case 'fugitiveEmissionsFromFuels':
        return fugitiveEmissionsFromFuelsConditionalNdc;
      case 'carbonDioxideTransportStorage':
        return carbonDioxideTransportStorageConditionalNdc;
      case 'industrialProcessesProductUse':
        return industrialProcessesProductUseConditionalNdc;
      case 'agricultureForestryOtherLandUse':
        return agricultureForestryOtherLandUseConditionalNdc;
      case 'waste':
        return wasteConditionalNdc;
      case 'other':
        return otherConditionalNdc;
      default:
        return 0;
    }
  };

  const getUnconditionalNdcSum = (panelHeading: any) => {
    switch (panelHeading) {
      case 'energyEmissions':
        return energyEmissionsUnconditionalNdc;
      case 'fuelCombustionActivities':
        return fuelCombustionActivitiesUnconditionalNdc;
      case 'fugitiveEmissionsFromFuels':
        return fugitiveEmissionsFromFuelsUnconditionalNdc;
      case 'carbonDioxideTransportStorage':
        return carbonDioxideTransportStorageUnconditionalNdc;
      case 'industrialProcessesProductUse':
        return industrialProcessesProductUseUnconditionalNdc;
      case 'agricultureForestryOtherLandUse':
        return agricultureForestryOtherLandUseUnconditionalNdc;
      case 'waste':
        return wasteUnconditionalNdc;
      case 'other':
        return otherUnconditionalNdc;
      default:
        return 0;
    }
  };

  const calculateSumBau = (event: any, panelHeading: any) => {
    const formValues = form.getFieldsValue();

    if (panelHeading === 'fuelCombustionActivities') {
      const sum =
        (formValues.fuelCombustionActivities_energyIndustries_bau || 0) +
        (formValues.fuelCombustionActivities_manufacturingIndustriesConstruction_bau || 0) +
        (formValues.fuelCombustionActivities_transport_bau || 0) +
        (formValues.fuelCombustionActivities_otherSectors_bau || 0) +
        (formValues.fuelCombustionActivities_nonSpecified_bau || 0);
      console.log('sum triggered', sum);
      setFuelCombustionActivitiesBau(sum);
    }
    if (panelHeading === 'fugitiveEmissionsFromFuels') {
      const sum =
        (formValues.fugitiveEmissionsFromFuels_solidFuels_bau || 0) +
        (formValues.fugitiveEmissionsFromFuels_oilNaturalGas_bau || 0) +
        (formValues.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_bau || 0);
      setFugitiveEmissionsFromFuelsBau(sum);
    }
    if (panelHeading === 'carbonDioxideTransportStorage') {
      const sum =
        (formValues.carbonDioxideTransportStorage_transportOfCo2_bau || 0) +
        (formValues.carbonDioxideTransportStorage_injectionStorage_bau || 0) +
        (formValues.carbonDioxideTransportStorage_other_bau || 0);
      setCarbonDioxideTransportStorageBau(sum);
    }
    if (panelHeading === 'industrialProcessesProductUse') {
      const sum =
        (formValues.industrialProcessesProductUse_mineralIndustry_bau || 0) +
        (formValues.industrialProcessesProductUse_chemicalIndustry_bau || 0) +
        (formValues.industrialProcessesProductUse_metalIndustry_bau || 0) +
        (formValues.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_bau || 0) +
        (formValues.industrialProcessesProductUse_electronicsIndustry_bau || 0) +
        (formValues.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_bau || 0) +
        (formValues.industrialProcessesProductUse_otherProductManufactureUse_bau || 0) +
        (formValues.industrialProcessesProductUse_other_bau || 0);
      setIndustrialProcessesProductUseBau(sum);
    }
    if (panelHeading === 'agricultureForestryOtherLandUse') {
      const sum =
        (formValues.agricultureForestryOtherLandUse_livestock_bau || 0) +
        (formValues.agricultureForestryOtherLandUse_land_bau || 0) +
        (formValues.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_bau || 0) +
        (formValues.agricultureForestryOtherLandUse_other_bau || 0);
      setAgricultureForestryOtherLandUseBau(sum);
    }
    if (panelHeading === 'waste') {
      const sum =
        (formValues.waste_solidWasteDisposal_bau || 0) +
        (formValues.waste_biologicalTreatmentSolidWaste_bau || 0) +
        (formValues.waste_incinerationOpenBurningWaste_bau || 0) +
        (formValues.waste_wastewaterTreatmentDischarge_bau || 0) +
        (formValues.waste_other_bau || 0);
      setWasteBau(sum);
    }
    if (panelHeading === 'other') {
      const sum =
        (formValues.other_indirectN2oEmissions_bau || 0) + (formValues.other_other_bau || 0);
      setOtherBau(sum);
    }
    return 0;
  };

  const calculateSumConditionalNdc = (event: any, panelHeading: any) => {
    const formValues = form.getFieldsValue();

    if (panelHeading === 'fuelCombustionActivities') {
      const sum =
        (formValues.fuelCombustionActivities_energyIndustries_conditionalNdc || 0) +
        (formValues.fuelCombustionActivities_manufacturingIndustriesConstruction_conditionalNdc ||
          0) +
        (formValues.fuelCombustionActivities_transport_conditionalNdc || 0) +
        (formValues.fuelCombustionActivities_otherSectors_conditionalNdc || 0) +
        (formValues.fuelCombustionActivities_nonSpecified_conditionalNdc || 0);
      setFuelCombustionActivitiesConditionalNdc(sum);
    }
    if (panelHeading === 'fugitiveEmissionsFromFuels') {
      const sum =
        (formValues.fugitiveEmissionsFromFuels_solidFuels_conditionalNdc || 0) +
        (formValues.fugitiveEmissionsFromFuels_oilNaturalGas_conditionalNdc || 0) +
        (formValues.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_conditionalNdc || 0);
      setFugitiveEmissionsFromFuelsConditionalNdc(sum);
    }
    if (panelHeading === 'carbonDioxideTransportStorage') {
      const sum =
        (formValues.carbonDioxideTransportStorage_transportOfCo2_conditionalNdc || 0) +
        (formValues.carbonDioxideTransportStorage_injectionStorage_conditionalNdc || 0) +
        (formValues.carbonDioxideTransportStorage_other_conditionalNdc || 0);
      setCarbonDioxideTransportStorageConditionalNdc(sum);
    }
    if (panelHeading === 'industrialProcessesProductUse') {
      const sum =
        (formValues.industrialProcessesProductUse_mineralIndustry_conditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_chemicalIndustry_conditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_metalIndustry_conditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_conditionalNdc ||
          0) +
        (formValues.industrialProcessesProductUse_electronicsIndustry_conditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_conditionalNdc ||
          0) +
        (formValues.industrialProcessesProductUse_otherProductManufactureUse_conditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_other_conditionalNdc || 0);
      setIndustrialProcessesProductUseConditionalNdc(sum);
    }
    if (panelHeading === 'agricultureForestryOtherLandUse') {
      const sum =
        (formValues.agricultureForestryOtherLandUse_livestock_conditionalNdc || 0) +
        (formValues.agricultureForestryOtherLandUse_land_conditionalNdc || 0) +
        (formValues.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_conditionalNdc ||
          0) +
        (formValues.agricultureForestryOtherLandUse_other_conditionalNdc || 0);
      setAgricultureForestryOtherLandUseConditionalNdc(sum);
    }
    if (panelHeading === 'waste') {
      const sum =
        (formValues.waste_solidWasteDisposal_conditionalNdc || 0) +
        (formValues.waste_biologicalTreatmentSolidWaste_conditionalNdc || 0) +
        (formValues.waste_incinerationOpenBurningWaste_conditionalNdc || 0) +
        (formValues.waste_wastewaterTreatmentDischarge_conditionalNdc || 0) +
        (formValues.waste_other_conditionalNdc || 0);
      setWasteConditionalNdc(sum);
    }
    if (panelHeading === 'other') {
      const sum =
        (formValues.other_indirectN2oEmissions_conditionalNdc || 0) +
        (formValues.other_other_conditionalNdc || 0);
      setOtherConditionalNdc(sum);
    }
    return 0;
  };

  const calculateSumUnconditionalNdc = (event: any, panelHeading: any) => {
    const formValues = form.getFieldsValue();

    if (panelHeading === 'fuelCombustionActivities') {
      const sum =
        (formValues.fuelCombustionActivities_energyIndustries_unconditionalNdc || 0) +
        (formValues.fuelCombustionActivities_manufacturingIndustriesConstruction_unconditionalNdc ||
          0) +
        (formValues.fuelCombustionActivities_transport_unconditionalNdc || 0) +
        (formValues.fuelCombustionActivities_otherSectors_unconditionalNdc || 0) +
        (formValues.fuelCombustionActivities_nonSpecified_unconditionalNdc || 0);
      setFuelCombustionActivitiesUnconditionalNdc(sum);
    }
    if (panelHeading === 'fugitiveEmissionsFromFuels') {
      const sum =
        (formValues.fugitiveEmissionsFromFuels_solidFuels_unconditionalNdc || 0) +
        (formValues.fugitiveEmissionsFromFuels_oilNaturalGas_unconditionalNdc || 0) +
        (formValues.fugitiveEmissionsFromFuels_otherEmissionsEnergyProduction_unconditionalNdc ||
          0);
      setFugitiveEmissionsFromFuelsUnconditionalNdc(sum);
    }
    if (panelHeading === 'carbonDioxideTransportStorage') {
      const sum =
        (formValues.carbonDioxideTransportStorage_transportOfCo2_unconditionalNdc || 0) +
        (formValues.carbonDioxideTransportStorage_injectionStorage_unconditionalNdc || 0) +
        (formValues.carbonDioxideTransportStorage_other_unconditionalNdc || 0);
      setCarbonDioxideTransportStorageUnconditionalNdc(sum);
    }
    if (panelHeading === 'industrialProcessesProductUse') {
      const sum =
        (formValues.industrialProcessesProductUse_mineralIndustry_unconditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_chemicalIndustry_unconditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_metalIndustry_unconditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_nonEnergyProductsFuelsSolventUse_unconditionalNdc ||
          0) +
        (formValues.industrialProcessesProductUse_electronicsIndustry_unconditionalNdc || 0) +
        (formValues.industrialProcessesProductUse_productUsesSubstOzoneDepletingSubs_unconditionalNdc ||
          0) +
        (formValues.industrialProcessesProductUse_otherProductManufactureUse_unconditionalNdc ||
          0) +
        (formValues.industrialProcessesProductUse_other_unconditionalNdc || 0);
      setIndustrialProcessesProductUseUnconditionalNdc(sum);
    }
    if (panelHeading === 'agricultureForestryOtherLandUse') {
      const sum =
        (formValues.agricultureForestryOtherLandUse_livestock_unconditionalNdc || 0) +
        (formValues.agricultureForestryOtherLandUse_land_unconditionalNdc || 0) +
        (formValues.agricultureForestryOtherLandUse_aggregateNonCo2SourcesLand_unconditionalNdc ||
          0) +
        (formValues.agricultureForestryOtherLandUse_other_unconditionalNdc || 0);
      setAgricultureForestryOtherLandUseUnconditionalNdc(sum);
    }
    if (panelHeading === 'waste') {
      const sum =
        (formValues.waste_solidWasteDisposal_unconditionalNdc || 0) +
        (formValues.waste_biologicalTreatmentSolidWaste_unconditionalNdc || 0) +
        (formValues.waste_incinerationOpenBurningWaste_unconditionalNdc || 0) +
        (formValues.waste_wastewaterTreatmentDischarge_unconditionalNdc || 0) +
        (formValues.waste_other_unconditionalNdc || 0);
      setWasteUnconditionalNdc(sum);
    }
    if (panelHeading === 'other') {
      const sum =
        (formValues.other_indirectN2oEmissions_unconditionalNdc || 0) +
        (formValues.other_other_unconditionalNdc || 0);
      setOtherUnconditionalNdc(sum);
    }
    return 0;
  };

  const renderPanelHeader = (panelHeading: any) => (
    <Row gutter={16}>
      <Col xl={12} md={12} className="panel-header-col">
        <span>{t(`ghgInventory:${panelHeading}`)}</span>
      </Col>
      <Col xl={9} md={9} className="panel-header-emission-value-col">
        <Row gutter={16}>
          <Col xl={7}>
            <div className="co2-total-pill">{getBauSum(panelHeading)}</div>
          </Col>
          <Col xl={7}>
            <div className="ch4-total-pill">{getConditionalNdcSum(panelHeading)}</div>
          </Col>
          <Col xl={7}>
            <div className="n2o-total-pill">{getUnconditionalNdcSum(panelHeading)}</div>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const renderPanelHeaderView = (panelHeading: any, tabData: any) => {
    const projectionObject = tabData[panelHeading];

    return (
      <Row gutter={16}>
        <Col xl={12} md={12} className="panel-header-col">
          <span>{t(`ghgInventory:${panelHeading}`)}</span>
        </Col>
        <Col xl={9} md={9}>
          <Row gutter={16} className="panel-header-emission-value-col">
            <Col xl={7}>
              <div className="co2-total-pill">
                {calculateSumEmissionView(projectionObject, 'bau')}
              </div>
            </Col>
            <Col xl={7}>
              <div className="ch4-total-pill">
                {calculateSumEmissionView(projectionObject, 'conditionalNdc')}
              </div>
            </Col>
            <Col xl={7}>
              <div className="n2o-total-pill">
                {calculateSumEmissionView(projectionObject, 'unconditionalNdc')}
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
          <Col xl={7}>
            <Form.Item name={panelHeading + '_' + item + '_bau'}>
              <InputNumber onChange={(event) => calculateSumBau(event, panelHeading)} />
            </Form.Item>
          </Col>
          <Col xl={7}>
            <Form.Item name={panelHeading + '_' + item + '_conditionalNdc'}>
              <InputNumber onChange={(event) => calculateSumConditionalNdc(event, panelHeading)} />
            </Form.Item>
          </Col>
          <Col xl={7}>
            <Form.Item name={panelHeading + '_' + item + '_unconditionalNdc'}>
              <InputNumber
                onChange={(event) => calculateSumUnconditionalNdc(event, panelHeading)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const renderPanelContentView = (
    bau: any,
    conditionalNdc: any,
    unconditionalNdc: any,
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
            <Col xl={7}>
              <InputNumber value={bau} disabled />
            </Col>
            <Col xl={7}>
              <InputNumber value={conditionalNdc} disabled />
            </Col>
            <Col xl={7}>
              <InputNumber value={unconditionalNdc} disabled />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <div className="content-container projection-tab-container">
        <div className="projection-title-bar">
          <div className="title-bar">
            <div className="body-title">{t(`ghgInventory:projections`)}</div>
            <div className="body-sub-title">{t(`ghgInventory:totalNationalEmissionSubTitle`)}</div>
          </div>
        </div>
        <div className="content-card add-projection">
          <Tabs defaultActiveKey="Add New" centered>
          {(userInfoState?.companyRole === CompanyRole.GOVERNMENT || userInfoState?.companyRole === CompanyRole.MINISTRY) && (
            <Tabs.TabPane key="Add New" tab={t(`ghgInventory:addNew`)}>
              <div>
                <Form
                  labelCol={{ span: 20 }}
                  wrapperCol={{ span: 24 }}
                  name="add-projection"
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
                      <Row className="add-new-upload-file-label">{t(`ghgInventory:emissionRemovalDocument`)}</Row>
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
                        <Col xl={7} className="table-heading-col">
                          Business As Usual (BAU)
                        </Col>
                        <Col xl={7} className="table-heading-col">
                          Conditional NDC
                        </Col>
                        <Col xl={7} className="table-heading-col">
                          Unconditional NDC
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
                        <Col xl={7}>
                          <div className="co2-total-pill">{totalNationalBau}</div>
                        </Col>
                        <Col xl={7}>
                          <div className="ch4-total-pill">{totalNationalConditionalNdc}</div>
                        </Col>
                        <Col xl={7}>
                          <div className="n2o-total-pill">{totalNationalUnconditionalNdc}</div>
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
                                //   <Col span={12} key={subPanelHeading}>
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
                      <span>
                        {t(`ghgInventory:totalCo2WithoutLand`)}
                      </span>
                    </Col>
                    <Col xl={9} md={9}>
                      <Row gutter={16} className="panel-content-input-box-row">
                        <Col xl={7}>
                          <Form.Item name="totalCo2WithoutLand_bau">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={7}>
                          <Form.Item name="totalCo2WithoutLand_conditionalNdc">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={7}>
                          <Form.Item name="totalCo2WithoutLand_unconditionalNdc">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={16} key={'totalCo2WithLand'} className="total-co2-with-land-row">
                    <Col xl={12} md={12} className="total-co2-with-land-title">
                      <span>
                        {t(`ghgInventory:totalCo2WithLand`)}
                      </span>
                    </Col>
                    <Col xl={9} md={9}>
                      <Row gutter={16} className="panel-content-input-box-row">
                        <Col xl={7}>
                          <Form.Item name="totalCo2WithLand_bau">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={7}>
                          <Form.Item name="totalCo2WithLand_conditionalNdc">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                        <Col xl={7}>
                          <Form.Item name="totalCo2WithLand_unconditionalNdc">
                            <InputNumber />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <div className="steps-actions">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                    >
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
                            <Col xl={7} className="table-heading-col">
                              Business As Usual (BAU)
                            </Col>
                            <Col xl={7} className="table-heading-col">
                              Conditional NDC
                            </Col>
                            <Col xl={7} className="table-heading-col">
                              Unconditional NDC
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
                            <Col xl={7}>
                              <div className="co2-total-pill">
                                {calculateSumEmissionView(tabData, 'bau')}
                              </div>
                            </Col>
                            <Col xl={7}>
                              <div className="ch4-total-pill">
                                {calculateSumEmissionView(tabData, 'conditionalNdc')}
                              </div>
                            </Col>
                            <Col xl={7}>
                              <div className="n2o-total-pill">
                                {calculateSumEmissionView(tabData, 'unconditionalNdc')}
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
                                        emissionsData?.bau,
                                        emissionsData?.conditionalNdc,
                                        emissionsData?.unconditionalNdc,
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
                                              emissionsData?.bau,
                                              emissionsData?.conditionalNdc,
                                              emissionsData?.unconditionalNdc,
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
