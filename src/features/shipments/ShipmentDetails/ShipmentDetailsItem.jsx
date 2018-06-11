import React from 'react';
import moment from 'moment';
import { Feed, Icon  } from 'semantic-ui-react';

const ShipmentDetailsItem = ({data}) => {
    const utcFormat = (dateStr) => moment(dateStr)
        .utc()
        .format("YYYY-MM-DD HH:mm A");
    const dateDiff = (dateStr) => {
      let thisDay = new Date();
      let transDate = moment(dateStr);
      let currentDate = moment(thisDay);
      return currentDate.diff(transDate, 'days'); 
    }

    const title = () => {
      const days = dateDiff(data.UpdateDate);
      if ( days === 0)
        return 'Today'
      else 
        return `${days} days ago`
    }

    return (
        <Feed.Event>
          <Feed.Label>
            <Icon name='history' color='orange' />
          </Feed.Label>
          <Feed.Content>
            <Feed.Date content={title()} />
            <Feed.Summary>
              {utcFormat(data.UpdateDate)} - <a>{data.TransactionType}</a> by {data.UpdateBy}
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
    )
}

export default ShipmentDetailsItem;
