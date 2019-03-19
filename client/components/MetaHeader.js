import React from 'react';
import { Helmet } from 'react-helmet';

const MetaHeader = (props) => {
  return (
    <Helmet>
      <meta charSet="utf-8"/>
      {
        props.title &&
        <title>{props.title}</title>
      }
      {
        props.description &&
        <meta name="description" content={props.description}/>
      }
      {
        props.description &&
        <meta name="og:description" content={props.description}/>
      }
      {
        (props.imageAlt && props.imageUrl) &&
        <meta property="og:image" alt={props.imageAlt} content={props.imageUrl}/>
      }
      {
        props.url &&
        <meta property="og:url" content="https://www.getcooked.co/services/weddings"/>
      }
    </Helmet>
  );
};

export default MetaHeader;
/**
 * Created by sachinkaria on 05/10/2018.
 */
