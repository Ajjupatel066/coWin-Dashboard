// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    coWinData: [],
  }

  componentDidMount() {
    this.getCowinData()
  }

  formatList = () => {}

  getCowinData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachDayData => ({
          vaccineDate: eachDayData.vaccine_date,
          dose1: eachDayData.dose_1,
          dose2: eachDayData.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(genderType => ({
          gender: genderType.gender,
          count: genderType.count,
        })),
      }
      this.setState({
        coWinData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderBarChart = () => {
    const {coWinData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={coWinData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={coWinData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={coWinData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoadingPage = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderVaccinationDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBarChart()
      case apiStatusConstants.inProgress:
        return this.renderLoadingPage()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="app-container">
          <div className="logo">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              className="cowin-logo"
              alt="website logo"
            />
            <h1 className="app-name">Co-WIN</h1>
          </div>
          <h1 className="sub-heading">CoWIN Vaccination in India</h1>
          {this.renderVaccinationDetails()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
