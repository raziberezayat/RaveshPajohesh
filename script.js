const fs = require('fs').promises

function generate_random_numner(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function main()
{
    var topics = await fs.readFile('topics.json', 'utf-8');
    topics = JSON.parse(topics);
    var groups = await fs.readFile('groups.json', 'utf-8');
    groups = JSON.parse(groups);
    var result = [];

    groups.sort(() => Math.random() - 0.5);


    var priorities = groups.map(group => group.priority);
    var priorities_filtered = priorities.map(priority => priority.filter(id => id == 13 || id == 14));
    console.log(priorities_filtered);
    var rate = priorities_filtered.filter(priority => priority[0] == 13).length / priorities_filtered.length;
    console.log(rate);
    if(rate>=5/6)
    {
        topics.find(topic => topic.id == 13).capacity = 5;
        topics.find(topic => topic.id == 14).capacity = 1;
    }

    else if(rate>=4/6)
    {
        topics.find(topic => topic.id == 13).capacity = 4;
        topics.find(topic => topic.id == 14).capacity = 2;
    }

    else if(rate>=3/6)
    {
        topics.find(topic => topic.id == 13).capacity = 3;
        topics.find(topic => topic.id == 14).capacity = 3;
    }

    else if(rate>=2/6)
    {
        topics.find(topic => topic.id == 13).capacity = 2;
        topics.find(topic => topic.id == 14).capacity = 4;
    }

    else
    {
        topics.find(topic => topic.id == 13).capacity = 1;
        topics.find(topic => topic.id == 14).capacity = 5;
    }


    for(var i=0;i<groups.length;i++)
    {

        for(var j=0;j<groups[i].priority.length;j++)
        {
            var topic_id = groups[i].priority[j];
            var topic = topics.find(topic => topic.id == topic_id);

            if(groups[i].memberCount==2)
            {
                if(topic.capacity == 0)
                {
                    continue;
                }

                else
                {
                    topic.capacity -= groups[i].memberCount/topic.groupCount;
                    result.push({groupName: groups[i].groupName, assignedTopic: topic.name});
                    break;
                }
            }

            else if(groups[i].memberCount==4)
            {
                if(topic.capacity == 0)
                {
                    continue;
                }
                
                if(topic.groupCount == 4)
                {
                    topic.capacity -= 1;
                    result.push({groupName: groups[i].groupName, assignedTopic: topic.name});
                    break;
                }

                else if(topic.groupCount == 2)
                {
                    var subGroup1 = groups[i].groupName + "-1";
                    result.push({groupName: subGroup1, assignedTopic: topic.name});
                    topic.capacity -= 1;

                    var subGroup2 = groups[i].groupName + "-2";
                    
                    for(var k=0;k<groups[i].priority.length;k++)
                    {
                        var topic_id = groups[i].priority[k];
                        var topic = topics.find(topic => topic.id == topic_id);
                        
                        if(topic.capacity == 0)
                        {
                            continue;
                        }
        
                        else
                        {
                            topic.capacity -= groups[i].memberCount/topic.groupCount;
                            result.push({groupName: subGroup2, assignedTopic: topic.name});
                            break;
                        }
                    }

                    break;
                }
            }
        }
    }


    await fs.writeFile('result.json', JSON.stringify(result, null, 4));

}

main()