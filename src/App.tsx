import {useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import './App.css'

interface Season {
    number: number;
    episodes: Episode[];
}

interface Episode {
    title: string;
    summary: string;
    rating: number;
}

function App() {
    const queryParameters = new URLSearchParams(window.location.search);
    const [show, setShow] = useState(queryParameters.get('show') ?? 'simpsons');
    const [seasons, setSeasons] = useState<Season[]>([]);

    useEffect(() => {
        fetch(`./${show}.json`)
            .then(res => res.json())
            .then(result => {
                setSeasons(result);
            });
    }, [show]);

    const getRatingClass = (rating: number) => {
        if (!rating)
            return '';
        if (rating > 9.5)
            return 'classic';
        if (rating > 8.4)
            return 'excellent';
        if (rating > 7.5)
            return 'great';
        if (rating >= 7)
            return 'good';
        if (rating > 6)
            return 'average';
        return 'crap';
    }

    const getEpisodeTooltip = (e: Episode) =>
        `<div>
            <h3>${e?.title}</h3>
            <p style="max-width: 400px">${e?.summary}</p>
        </div>`;

    const maxEpisodeCount = Math.max(...seasons.map(s => s.episodes.length), 0);

  return (
    <div className={"App " + show}>

        <div>
            <select
                value={show}
                onChange={e => setShow(e.target.value)}>
                <option value="bluey">Bluey</option>
                <option value="simpsons">The Simpsons</option>
                <option value="futurama">Futurama</option>
                <option value="southpark">South Park</option>
                <option value="scrubs">Scrubs</option>
                <option value="lost">Lost</option>
            </select>

            <table>
                <caption>Seasons</caption>
                <tr>
                    <th></th>
                    {
                        seasons.map((_, index) => <th className="season">{ index + 1 }</th>)
                    }
                </tr>
                {
                    [...Array(maxEpisodeCount)].map((_, index) =>
                        <tr>
                            <td className="season">{index + 1}</td>
                            {
                                seasons.map(s => s.episodes[index]).map(e =>
                                    <td className={"episode " + getRatingClass(e?.rating)}>
                                        <a data-tooltip-id="episode-tooltip"
                                           data-tooltip-html={getEpisodeTooltip(e)}>{e?.rating?.toFixed(1)}</a>
                                    </td>
                                )
                            }
                        </tr>
                    )
                }
            </table>
        </div>


      <Tooltip id="episode-tooltip"/>
    </div>
  )
}

export default App
