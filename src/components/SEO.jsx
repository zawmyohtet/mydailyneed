import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'MyDailyNeed'
const SITE_URL = 'https://mydailyneed.com'
const DEFAULT_DESCRIPTION = 'Free developer utility tools that run entirely in your browser. JSON formatter, XML tools, text utilities, and more.'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  featureList,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = `${SITE_URL}${path}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title ? `${title} - ${SITE_NAME}` : SITE_NAME,
    description,
    url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(featureList && { featureList }),
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}
