import dayjs, { Dayjs } from 'dayjs';

/**
 * GraphQL query provided from AKAMON
 */
export const QUERY = `
  query spot_price_chart_SpotPricePeriodicQuery(
    $tenantId: ID!
    $deliveryArea: String!
    $start: String!
    $end: String!
    $resolution: String!
  ) {
    marketPrices {
      periodicSpotPrices(
        tenantId: $tenantId
        deliveryArea: $deliveryArea
        start: $start
        end: $end
        resolution: $resolution
      ) {
        maxPriceWithoutVat
        meanPriceWithoutVat
        minPriceWithoutVat
        period {
          complete
          end
          identifier
          length {
            days
            hours
          }
          start
          type
        }
        unit
      }
    }
  }
`;

export const fetchPrices = async (
    start: Dayjs,
    end: Dayjs,
    resolution: string,
    setter: (prices: any[]) => void
  ) => {
    try {
        const response = await fetch('https://graphql.staging.akamon.cloud/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: QUERY,
                variables: {
                    tenantId: "AKAMON",
                    deliveryArea: "FI",
                    start: start.startOf('day').toISOString(),
                    end: end.endOf('day').toISOString(),
                    resolution,
                },
            }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
 
      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      setter(result.data.marketPrices.periodicSpotPrices);

    } catch (error) {
        console.error("Price fetching failed", error);
        setter([]);
    }
  }
