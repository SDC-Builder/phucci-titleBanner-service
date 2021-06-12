import React, { lazy } from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import './style.css';
import colors from './icons/backgroundImages';

import Titles from './components/titles.jsx';
import Enrolled from './components/enrolled.jsx';
import Stars from './components/totalStars.jsx';
import request from './lib/request.js';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];



class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
      num: 0,
      titles: '',
      totalEnrolled: 0,
      instructor: `Phucci Octocat`,
      offeredBy: `Phucci University`,
      img: 'https://image.pngaaa.com/381/1633381-middle.png',
      month: '',
      date: 0,
      totalReviews: 10000,
      totalStars: 5,
      color: '',
    };
    this.onChange = this.onChange.bind(this);
    this.add = this.add.bind(this);
    this.stars = this.stars.bind(this);
  }

  // API Get request
  componentDidMount() {

    if (document) {
      var uri = window.location.href.split('/');
      var id = uri[uri.length - 1] === '' ? 1 : uri[uri.length - 1];
    }

    axios.get(`api/title/${id}`)
      .then((response) => {
        this.setState({
          titles: response.data.tittle,
          totalEnrolled: response.data.enrollments,
          month: months[Math.floor(Math.random() * months.length)],
          date: Math.floor(Math.random() * 30),
          color: colors[Math.floor(Math.random() * colors.length)]
        });

      })
      .catch(err => console.log('Issue with getting course Title', err));


    //get instructors name

    axios.get(`http://54.176.19.199:3003/api/instructors/${id}`)
      .then(response => {
        this.setState({
          instructor: `${response.data[0].firstName} ${response.data[0].lastName}`
        });
      })
      .catch(err => console.log('Cannot get instructors', err));


    axios.get(`http://54.176.19.199:3003/api/offeredBy/${id}`)
      .then(response => {
        this.setState({
          offeredBy: response.data[0].offeredByName
        });
      })
      .catch(err => console.log('Cannot get offered by', err));

    axios.get(`http://54.176.19.199:3006/api/image/${id}/primaryInstructor `)
      .then(response => {
        this.setState({
          img: response.data.primaryInstructor
        });
      })
      .catch(err => console.log('Could not get images', err));


    axios.get(`http://3.139.47.159/api/totalReviewScore/${id}`)
      .then(response => {
        this.setState({
          totalReviews: response.data.reviewCount,
          totalStars: response.data.totalStarScore
        });
      })
      .catch(err => console.log('Could not get reviews', err));
  }


  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback)=>{
      return;
    };
  }

  onChange (e) {
    this.setState({
      num: Number(e.target.value)
    });
  }


  //TODO: Can remove as used only for seeding
  add() {
    $.ajax({
      type: 'POST',
      url: 'http://3.140.219.139/api/addTitle',
      data: {total: this.state.num},
      success: () => console.log('successfully made a post')
    });
  }

  stars(count) {
    var starHTML = '';
    var partialStar = count - Math.floor(count);
    count = Math.floor(count);
    var i = 0;
    var max = 5;

    var filled = '<span><svg aria-hidden="true" class="_ufjrdd" style="fill:#F2D049;height:14px;width:14px;margin-right:2px;vertical-align:text-bottom" viewBox="0 0 46 44" role="img" aria-labelledby="FilledStarb719e308-d246-4809-8266-c154e6d4348e FilledStarb719e308-d246-4809-8266-c154e6d4348eDesc" xmlns="http://www.w3.org/2000/svg"><title>Filled Star</title><path stroke="#7C6919" stroke-width="3" d="M23 36.5L8.893 43.916l2.694-15.708L.175 17.084l15.772-2.292L23 .5l7.053 14.292 15.772 2.292-11.412 11.124 2.694 15.708z" fill-rule="evenodd" role="presentation"></path></svg></span>';

    var unfilled = '<span><svg aria-hidden="true" class="_ufjrdd" style="fill:#FFF;height:14px;width:14px;margin-right:2px;vertical-align:text-bottom" viewBox="0 0 46 44" role="img" aria-labelledby="Stara42a4903-db84-4b61-b393-a9494d894b2d Stara42a4903-db84-4b61-b393-a9494d894b2dDesc" xmlns="http://www.w3.org/2000/svg"><title>Star</title><path d="M23 35.37l-12.779 6.718 2.44-14.229L2.325 17.782l14.287-2.076L23 2.76l6.39 12.946 14.286 2.076-10.338 10.077 2.44 14.23L23 35.37z" stroke="#7C6919" stroke-width="2" fill="#FFF" fill-rule="evenodd" role="presentation"></path></svg></span>';

    var halfStar = '<span><svg aria-hidden="true" class="_ufjrdd" style="fill:#F2D049;height:14px;width:14px;margin-right:2px;vertical-align:text-bottom" viewBox="0 0 46 44" role="img" aria-labelledby="HalfFilledStara9d8fe4c-b375-42fb-d461-d285fe2c5893 HalfFilledStara9d8fe4c-b375-42fb-d461-d285fe2c5893Desc" xmlns="http://www.w3.org/2000/svg"><title>Half Filled Star</title><path stroke="#7C6919" stroke-width="3" d="M23 0l7.053 14.292 15.772 2.292-11.412 11.124 2.694 15.708L23 36 8.893 43.416l2.694-15.708L.175 16.584l15.772-2.292L23 0zm0 4v29.85L34.743 40 32.5 26.975l9.5-9.224-13.129-1.9L23 4z" role="presentation"></path><polygon fill="#FFF" stroke-width="3" stroke="#7C6919" points="22.8253564 36 22.8253564 2.34479103e-13 29.8787794 14.2917961 45.6507128 16.5835921 34.2380346 27.7082039 36.9322024 43.4164079" role="presentation"></polygon></svg></span>';

    while (i < count) {
      starHTML += filled;
      i++;
    }

    if (partialStar && partialStar > 0.25 && partialStar <= 0.75) {
      starHTML += halfStar;
      count++;
    } else if (partialStar && partialStar > 0.75) {
      starHTML += filled;
      count++;
    }

    while (max > count) {
      starHTML += unfilled;
      max--;
    }

    return starHTML;
  }


  render() {
    return (
      <div className="title-service" style={ {backgroundImage: `linear-gradient(${this.state.color})`} }>
        <div className="title-inner">
          <div className="title-service1">
            <div className="title-nav">
              Browse {'>'}   Department {'>'}   {this.state.titles}
            </div>
            <div className="banner-title">
              <Titles title={this.state.titles}/>
            </div>
            <div className="title-star">
              <Stars stars={this.stars} rating={this.state.totalStars} />
              <span className="title-num">{this.state.totalStars}</span>
              <span className="title-rating">{this.state.totalReviews} ratings</span>
            </div>
            <div className="instructor-main">
              <img src= {this.state.img} alt="instructor" className="instructor"/>
              <span className = "title-instructorName">
                {this.state.instructor}
              </span>
              <span id="title-top-instructor">Top instructor</span>
            </div>
            <div className="white-box">
              <div className="title-charge"> Enroll for Free</div>
              <div className="title-date">Starts {this.state.month} {this.state.date}</div>
            </div>
            <div className="title-aid">Financial aid available</div>
            <div className="enrolled">
              <span> <Enrolled enrolled={this.state.totalEnrolled} /> </span>
              <span style = { {marginLeft: '10px'} }>already enrolled</span>
            </div>
          </div>
          <div className="side-bar">
            <span>
              <p className="offered">Offered By </p>
              <div className="university">{this.state.offeredBy}</div>
            </span>
          </div>
        </div>
      </div>
    );
  }
}


ReactDom.render(<Title />, document.getElementById('title'));


