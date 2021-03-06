/**
 * Created by twi18192 on 06/04/16.
 */

var React = require('react');

var LEDWidget = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttributeValue !== this.props.blockAttributeValue
    )
  },

  render: function(){
    return(

      <svg style={{width: '150', height: '20'}}  >
        <circle r="8" className={"ledWidget" + (this.props.blockAttributeValue ? 'ON' : 'OFF')}
                      transform="translate(9, 11)" />
      </svg>

    )
  }
});

module.exports = LEDWidget;
