export const Projects = () => {
  return (
    <>
      <h3>@ Pluralsight</h3>
      <h4>FinTech Support Tooling - Technical Lead</h4>
      <p>
        A comprehensive set of tools built in NextJS to provide an interface to
        manage Pluralsight B2B Subscriptions, scan 100,000 accounts for issues,
        look for problems, and provide non technical stakeholders with the
        ability to correct issues.
      </p>
      <p>
        This has saved hundreds of hours of developer time, and allowed the
        FinTech team to focus on bigger picture problems, instead of manually
        correcting issues with accounts. As part of this project I also mentored
        developers and encouraged them to help make technical decisions for this
        internal project. This has put the team in a much better place, and
        helped other developers take ownership of various parts of the project.
      </p>

      <h4>Entitlements - Technical Lead</h4>
      <p>
        A complete rewrite of the Pluralsight b2b provisioning engine. Written
        in NestJS and designed to provide a simple but powerful interface for
        salesforce to update the Pluralsight platform asynchronously with
        changes, including but not limited to self healing APIs, developer
        tools, automated subscription updates, error detection and auto
        correction.
      </p>
      <p>
        As the technical lead on this project I integrated with Kafka, RabbitMQ,
        and various internal pluralsight systems to fully provision any b2b
        customer.
      </p>
    </>
  );
};
