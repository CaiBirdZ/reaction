import _ from "lodash";
import React from "react";
import { PropTypes } from "prop-types";
import { Query } from "react-apollo";
import Logger from "@reactioncommerce/logger";
import ReactionError from "@reactioncommerce/reaction-error";
import { loadMore } from "/imports/plugins/core/graphql/lib/helpers/pagination";
import getTags from "../queries/getTags";
import { getTagIds } from "/lib/selectors/tags";

export default (Component) => (
  class Tags extends React.Component {
    static propTypes = {
      shouldSkipGraphql: PropTypes.bool // Whether to skip this HOC's GraphQL query & data
    };

    render() {
      const { shouldSkipGraphql, shopId } = this.props;

      if (shouldSkipGraphql || !shopId) {
        return (
          <Component {...this.props} />
        );
      }

      const variables = {
        shopId,
        isTopLevel: true,
        first: 200,
        sortBy: "name"
      };

      return (
        <Query query={getTags} variables={variables}>
          {({ error, loading, data, fetchMore }) => {
            if (error) {
              Logger.error(error);
              throw new ReactionError("query-error");
            }
            const props = {
              ...this.props,
              isLoading: loading
            };

            if (loading === false) {
              if (!data) {
                return <Component {...props} shouldSkipGraphql />;
              }
              if (data.tags && data.tags.pageInfo && data.tags.pageInfo.hasNextPage) {
                loadMore({
                  queryName: "tags",
                  pageInfo: data.tags.pageInfo,
                  first: 200,
                  fetchMore
                });
                return <Component {...props} isLoading={true}/>;
              }
              const { tags: { edges } } = data;
              const tags = edges.map((edge) => edge.node);
              _.sortBy(tags, this.props.sortBy || "position"); // puts tags without position at end of array
              const tagsByKey = {};

              if (Array.isArray(tags)) {
                for (const tag of tags) {
                  tagsByKey[tag._id] = tag;
                }
              }
              props.tags = tags;
              props.tagsByKey = tagsByKey;
              props.tagIds = getTagIds({ tags });
            }

            return (
              <Component {...props} />
            );
          }}
        </Query>
      );
    }
  }
);
