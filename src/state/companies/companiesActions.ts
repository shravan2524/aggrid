import { CompaniesType, fetchCompaniesData } from 'services/companiesAPIService';
import { companiesSlice } from './companiesSlice';

const {
  startLoading,
  setCompanySuccessResponse,
  setSelectedCompany,
} = companiesSlice.actions;

export const fetchCompanies = () => async (dispatch) => {
  try {
    dispatch(startLoading());

    const data: CompaniesType[] = await fetchCompaniesData();
    if (data) {
      dispatch(setCompanySuccessResponse(data));

      if (data.length) {
        dispatch(setSelectedCompany(data[0]));
      }
    }
  } catch (e) {
    // dispatch(setErrorResponse(processAPIError(e)));
  }
};

export { setSelectedCompany };
