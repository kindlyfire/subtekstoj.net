import React from 'react'
import SubtitleList from '../../components/SubtitleList/SubtitleList'

const items = [
    {
        name: 'Test subtitle',
        author: 'KindlyFire',
        downloadCount: 105
    },
    {
        name: 'Test subtitle',
        author: 'KindlyFire',
        downloadCount: 105
    },
    {
        name: 'Test subtitle',
        author: 'KindlyFire',
        downloadCount: 105
    },
    {
        name: 'Test subtitle',
        author: 'KindlyFire',
        downloadCount: 105
    },
    {
        name: 'Test subtitle',
        author: 'KindlyFire',
        downloadCount: 105
    }
]

export default function Index() {
    return (
        <div className="container">
            <h1 style={{ marginBottom: '12px' }}>Recently added subtitles</h1>
            <SubtitleList items={items} />

            <h1 style={{ marginBottom: '12px' }}>Popular subtitles</h1>
            <SubtitleList items={items} />
        </div>
    )
}
