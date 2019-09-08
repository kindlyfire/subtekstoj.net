import React from 'react'
import './SubtitleList.css'
import DownloadIcon from '../../assets/download-icon.svg'

export default function SubtitleList({ items = [] }) {
    return (
        <div className="SubtitleList">
            {items.map(item => (
                <div className="SubtitleList-item">
                    <div className="SubtitleList-item--title">{item.name}</div>
                    <div className="SubtitleList-item--auhor">
                        {item.author}
                    </div>
                    <div className="SubtitleList-item--downloads">
                        {item.downloadCount}
                        <img src={DownloadIcon} alt="Downloads" />
                    </div>
                </div>
            ))}
        </div>
    )
}
