import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Masonry from 'react-masonry-css';
import './portfolio.scss';

interface Project {
  id: string;
  preview: string;
  title: string;
  tag: string;
}

interface GalleryState {
  projects: Project[];
  filterResult: Project[] | null;
  pickedFilter: string;
  filterMenuActive: boolean;
  pickedFilterDropdown: string;
}

interface ProjectBoxProps {
  preview: string;
  title: string;
  tag: string;
}

const ProjectBox: React.FC<ProjectBoxProps> = ({ preview, title, tag }) => (
  <div className="portfolio__box">
    <img src={preview} alt="project" />
    <div className="portfolio__hover-info flex-center">
      <div className="text-center">
        <p className="font30 weight800">{title}</p>
        <p className="font12 weight500">{tag}</p>
      </div>
    </div>
  </div>
);

class Gallery extends Component<{}, GalleryState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      projects: [
        { id: '1', preview: '/portfolio/project01/preview.png', title: 'Lamp', tag: 'branding' },
        { id: '2', preview: '/portfolio/project02/preview.png', title: 'Smartwatch', tag: 'web' },
        { id: '3', preview: '/portfolio/project03/preview.png', title: 'Speakerphone', tag: 'illustrations' },
        { id: '4', preview: '/portfolio/project04/preview.png', title: 'Sneakers', tag: 'web' },
        { id: '5', preview: '/portfolio/project05/preview.png', title: 'Label', tag: 'illustrations' },
        { id: '6', preview: '/portfolio/project06/preview.png', title: 'Lemons', tag: 'branding' },
      ],
      filterResult: null,
      pickedFilter: 'all',
      filterMenuActive: false,
      pickedFilterDropdown: 'NEWEST',
    };
  }

  componentDidMount() {
    this.filterGallery('all');
  }

  filterGallery = (target: string) => {
    const { projects } = this.state;
    let result: Project[];

    if (target !== 'all') {
      result = projects.filter((project) => project.tag === target);
    } else {
      result = projects;
    }

    this.setState({ filterResult: result, pickedFilter: target, pickedFilterDropdown: 'NEWEST' });
  };

  filterMenuHover = (hover: boolean) => {
    this.setState({ filterMenuActive: hover });
  };

  filterDropDownHandler = (filter: string) => {
    const { filterResult } = this.state;

    if (filterResult) {
      let result: Project[];

      if (filter === 'NEWEST') {
        result = filterResult.sort((a, b) => (a.id > b.id ? 1 : -1));
      } else if (filter === 'OLDEST') {
        result = filterResult.sort((a, b) => (a.id > b.id ? 1 : -1)).reverse();
      } else {
        result = filterResult;
      }

      this.setState({ filterResult: result, pickedFilterDropdown: filter, filterMenuActive: false });
    }
  };

  render() {
    const { filterResult, pickedFilter, filterMenuActive, pickedFilterDropdown } = this.state;

    const projectsRender = filterResult?.map((project) => (
      <ProjectBox preview={project.preview} key={project.id} title={project.title} tag={project.tag} />
    ));

    const portfolioBreakpoints = {
      default: 3,
      1100: 3,
      700: 2,
      500: 1,
    };

    return (
      <div id="portfolio">
        <div className="wrapper">
          <Masonry breakpointCols={portfolioBreakpoints} className="my-masonry-grid" columnClassName="mint__gallery">
            {projectsRender}
          </Masonry>
        </div>
      </div>
    );
  }
}

export default Gallery;
