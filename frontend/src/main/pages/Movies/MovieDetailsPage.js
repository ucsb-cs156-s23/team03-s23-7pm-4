import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MovieTable from 'main/components/Movies/MovieTable';
import { movieUtils } from 'main/utils/movieUtils';
import { useCurrentUser } from 'main/utils/currentUser'
import { useBackend } from 'main/utils/useBackend';

export default function MovieDetailsPage() {
  let { id } = useParams();
  const currentUser = useCurrentUser();

  const { data: movie, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/movies?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/movies`,
        params: {
          id
        }
      }
    );

    return (
      <BasicLayout>
        <div className="pt-2">
          <h1>Movie Details</h1>
          <MovieTable movies={[movie || {}]} currentUser={currentUser} showButtons={false} />
      </div>
    </BasicLayout>
  )
}