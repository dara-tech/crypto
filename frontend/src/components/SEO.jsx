import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { defaultMetadata } from '../config/metadata';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  twitterCard,
  twitterSite,
  twitterCreator,
  siteName,
  children 
}) => {
  const metaTitle = title || defaultMetadata.title;
  const metaDescription = description || defaultMetadata.description;
  const metaKeywords = keywords || defaultMetadata.keywords;
  const metaOgImage = ogImage || defaultMetadata.ogImage;
  const metaTwitterCard = twitterCard || defaultMetadata.twitterCard;
  const metaTwitterSite = twitterSite || defaultMetadata.twitterSite;
  const metaTwitterCreator = twitterCreator || defaultMetadata.twitterCreator;
  const metaSiteName = siteName || defaultMetadata.siteName;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={defaultMetadata.author} />
      
      {/* Open Graph metadata */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaOgImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={metaSiteName} />
      
      {/* Twitter metadata */}
      <meta name="twitter:card" content={metaTwitterCard} />
      <meta name="twitter:site" content={metaTwitterSite} />
      <meta name="twitter:creator" content={metaTwitterCreator} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaOgImage} />
      
      {children}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  twitterCard: PropTypes.string,
  twitterSite: PropTypes.string,
  twitterCreator: PropTypes.string,
  siteName: PropTypes.string,
  children: PropTypes.node,
};

export default SEO; 